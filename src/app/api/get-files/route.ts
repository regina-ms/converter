import fs, { existsSync } from 'node:fs'
import fsAsync from 'node:fs/promises'
import sharp from 'sharp'
import { convertImageSize } from '@/features/convertImageSize'
import { NextRequest } from 'next/server'

export type ImageData = {
  dataUrl: string
  originalBuffer: Buffer
  name: string
  size: string
  width: number
  height: number
  format: keyof sharp.FormatEnum | undefined
}

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path') || ''

  if (!existsSync(path)) {
    fs.mkdirSync(path)
  }

  const fileNames = await fsAsync.readdir(path)
  const data = await Promise.all(
    fileNames.map(async (name) => {
      const file = await fsAsync.readFile(`${path}/${name}`)
      const meta = await sharp(file).metadata()
      const size = convertImageSize(meta.size)
      const width = meta.width || 0
      const height = meta.height || 0
      const format = meta.format
      return { name, size, width, height, format }
    }),
  )

  return Response.json({ data })
}
