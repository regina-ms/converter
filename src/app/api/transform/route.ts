import { Action } from '@/actionsTypes'
import { ARCHIVE_NAME, COOKIE_ID, USER_RAW_IMAGES_FOLDER, USER_TRANSFORMED_IMAGES_FOLDER } from '@/constants'
import { getFormattedOptions } from '@/features/getFormattedOptions'
import { getIdFromPath } from '@/features/getIdFromPath'
import { SavedImage } from '@/methods/uploadFiles'
import { imagesFolder, userDir } from '@/methods/userDir'
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

type TransformedFilesData = { path: string; name: string }

async function createTransformedFiles(
  rawFiles: SavedImage[],
  actions: Action<'convert' | 'resize'>[],
  userId: string,
): Promise<TransformedFilesData[]> {
  return await Promise.all(
    rawFiles.map(async (image) => {
      const convert = actions.find((action) => action.id === 'convert') as Action<'convert'> | undefined
      const resize = actions.find((action) => action.id === 'resize') as Action<'resize'> | undefined
      const outputDir = imagesFolder(userId, USER_TRANSFORMED_IMAGES_FOLDER)
      await fs.mkdir(outputDir, { recursive: true })
      const imagePath = path.join(imagesFolder(userId, USER_RAW_IMAGES_FOLDER), getIdFromPath(image.url))
      let buffer = sharp(imagePath)

      if (resize) buffer = buffer.resize(resize.data)
      if (convert) {
        const options = getFormattedOptions(convert.data.options)
        buffer = buffer.toFormat(convert.data.format, options)
      }

      const ext = path.extname(image.name)
      const newName = convert ? image.name.replaceAll(ext, `.${convert.data.format}`) : image.name
      await buffer.toFile(`${outputDir}/transformed_${newName}`)

      return { path: path.join(outputDir, `transformed_${newName}`), name: newName }
    }),
  )
}

async function createArchive(userId: string, transformedData: TransformedFilesData[]): Promise<{ href: string }> {
  const archivePath = path.join(userDir(userId), ARCHIVE_NAME)
  const output = createWriteStream(archivePath)
  const archive = archiver('zip', { zlib: { level: 6 } })
  archive.pipe(output)

  for (const data of transformedData) {
    archive.file(data.path, { name: data.name })
  }

  await archive.finalize()
  return { href: `/api/download/${userId}` }
}

export async function POST(request: NextRequest) {
  let userId = request.cookies.get(COOKIE_ID)?.value
  if (!userId) {
    return NextResponse.json({ error: 'Нарушение прав доступа' }, { status: 401 })
  }

  try {
    const { rawImages, actions } = (await request.json()) as Body
    const processedImages = await createTransformedFiles(rawImages, actions, userId)

    if (processedImages.length > 0) {
      const { href } = await createArchive(userId, processedImages)

      return NextResponse.json({ href })
    } else {
      return NextResponse.json({ href: undefined }, { status: 500 })
    }
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message || 'Ошибка преобразования файлов' }, { status: 500 })
  }
}
