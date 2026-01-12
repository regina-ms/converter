import { Action } from '@/actionsTypes'
import { Body } from '@/app/api/transform-files/types'
import { getFormattedOptions } from '@/features/getFormattedOptions'
import { NextRequest } from 'next/server'
import sharp from 'sharp'
import { PUBLIC_PATHS } from '@/constants'
import fs, { existsSync } from 'node:fs'
import fsAsync from 'node:fs/promises'


export async function POST(request: NextRequest) {
  if (!request.body) return Response.json({ data: 'no' })

  const reqBody:Body = await request.json()
  const { fileNames, actions } = reqBody


  if (!existsSync(PUBLIC_PATHS.output)) {
    fs.mkdirSync(PUBLIC_PATHS.output)
  }

  for (const name of fileNames) {
    const file = await fsAsync.readFile(`${PUBLIC_PATHS.input}/${name}`)
    let stream = sharp(file).keepMetadata()
    const fileNameParts = Array.from<Array<string>>(name.matchAll(/(.+)(\..+$)/g))[0]
    const fileName = fileNameParts[1]
    let format = fileNameParts[2]

    const resize = actions.find((action) => action.id === 'resize') as Action<'resize'>
    if(resize) {
      stream.resize(resize.data)
    }

    const convert = actions.find((action) => action.id === 'convert') as Action<'convert'>
    if(convert) {
      const options = getFormattedOptions(convert.data.options)
      stream.toFormat(convert.data.format, options)
      format = `.${convert.data.format}`
    }

    await stream.toFile(`${PUBLIC_PATHS.output}/${fileName}${format}`)
  }

  return Response.json({ data: 'ok' })
}
