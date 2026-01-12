import fs from 'node:fs'
import archiver from 'archiver'
import { PUBLIC_FOLDER } from '@/constants'

interface TResponse extends Response{
  data : {
    path: string
  }
}

export async function POST(request: Request):Promise<Response> {
  const output = fs.createWriteStream('public/result.zip')
  const archive = archiver('zip')

  archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
    } else {
      throw err
    }
  })

  archive.on('error', function (err) {
    throw err
  })

  archive.pipe(output)

  archive.directory(`${PUBLIC_FOLDER}/output/`, false)

  await archive.finalize()

  return Response.json({ data: {
    path:`${PUBLIC_FOLDER}/output/result.zip`
    } })
}
