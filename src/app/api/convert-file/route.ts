import sharp from 'sharp'
import { PUBLIC_PATHS } from '@/constants'
import fs, { existsSync } from 'node:fs'
import fsAsync from 'node:fs/promises'

export async function POST(request: Request) {
  if (!request.body) return Response.json({ data: 'no' })

  const reqBody = await request.json()
  const { format, fileName } = reqBody

  if (!existsSync(PUBLIC_PATHS.output)) {
    fs.mkdirSync(PUBLIC_PATHS.output)
  }

  const _fileName = Array.from<Array<string>>(fileName.matchAll(/(.+)(\..+$)/g))[0][1]
  const inputFile = await fsAsync.readFile(`${PUBLIC_PATHS.input}/${fileName}`)

  await sharp(inputFile).keepMetadata().toFormat(format).toFile(`${PUBLIC_PATHS.output}/${_fileName}.${format}`)

  return Response.json({ data: 'ok' })
}
