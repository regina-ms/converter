import { Action } from '@/actionsTypes'
import { Body } from '@/app/api/transform-files/types'
import { getFormattedOptions } from '@/features/getFormattedOptions'
import { TransformedFile } from '@/methods/transformFiles'
import { NextRequest } from 'next/server'
import sharp from 'sharp'

export async function POST(request: NextRequest) {

  try {
    const reqBody:Body = await request.json()
    const { files , actions } = reqBody

    const transformedData:TransformedFile[] = await Promise.all(files.map( async (file) => {
      const convert = actions.find((action) => action.id === 'convert') as Action<'convert'>
      const resize = actions.find((action) => action.id === 'resize') as Action<'resize'>
      const buffer = Buffer.from(file.originalBuffer.data)
      let stream = sharp(buffer).keepMetadata()

      if(resize) {
        stream = stream.resize(resize.data)
      }

      if(convert) {
        const options = getFormattedOptions(convert.data.options)
        stream = stream.toFormat(convert.data.format, options)
      }

      const processedBuffer = await stream.toBuffer()
      const format = convert.data.format || file.format

      return {
        name: `${file.name}.${format}`,
        format: file.format,
        originalBuffer: {
          type: 'Buffer',
          data: Array.from(processedBuffer)
        }
      }
    }))

    return Response.json({data: transformedData})

  } catch (e:any) {
    throw new Error()
  }
}
