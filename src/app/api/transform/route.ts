import { Action } from '@/actionsTypes'
import { getFormattedOptions } from '@/features/getFormattedOptions'
import { getIdFromPath } from '@/features/getIdFromPath'
import { SavedImage } from '@/methods/uploadFiles'
import { userDir } from '@/methods/userDir'
import archiver from 'archiver'
import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import { createWriteStream } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

type Body = {
  rawImages: SavedImage[]
  actions: Action<'resize' | 'convert'>[]
}

export async function POST(request: NextRequest) {
  let userId = request.cookies.get('guest-id')?.value
  if (!userId) {
    return NextResponse.json('Unauthorized', { status: 401 })
  }

  const { rawImages, actions } = (await request.json()) as Body

  const processedImages = await Promise.all(
    rawImages.map(async (image) => {
      const convert = actions.find((action) => action.id === 'convert') as Action<'convert'> | undefined
      const resize = actions.find((action) => action.id === 'resize') as Action<'resize'> | undefined
      const outputDir = path.join(userDir(userId), '/transformed')
      await fs.mkdir(outputDir, { recursive: true })
      const imagePath = path.join(userDir(userId), getIdFromPath(image.url))

      if (!imagePath.startsWith(userDir(userId)) || !outputDir.startsWith(userDir(userId))) {
        throw NextResponse.json('Forbidden', { status: 403 })
      }

      let buffer = sharp(imagePath)
      try {
        if (resize) buffer = buffer.resize(resize.data)
        if (convert) {
          const options = getFormattedOptions(convert.data.options)
          buffer = buffer.toFormat(convert.data.format, options)
        }

        const ext = path.extname(image.name)
        const newName = convert ? image.name.replaceAll(ext, `.${convert.data.format}`) : image.name
        await buffer.toFile(`${outputDir}/transformed_${newName}`)

        return { path: path.join(outputDir, `transformed_${newName}`), name: newName }
      } catch (err) {
        throw NextResponse.json({ error: 'Transform failed', details: (err as Error).message }, { status: 500 })
      }
    }),
  )

  if (processedImages.length > 0) {
    const archivePath = path.join(userDir(userId), 'converter.zip')
    const output = createWriteStream(archivePath)
    const archive = archiver('zip', { zlib: { level: 6 } })
    archive.pipe(output)

    for (const image of processedImages) {
      archive.file(image.path, { name: image.name })
    }

    await archive.finalize()
  }

  /* TODO: реализовать удаление файлов после скачивания архива, возможно стоит спросить пользователя */
  return NextResponse.json({ url: `/api/download/${userId}` })
}
