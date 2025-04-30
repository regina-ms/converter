import fs from 'node:fs'
import archiver from 'archiver'

export async function POST(request: Request) {
  const output = fs.createWriteStream('public/result.zip')
  const archive = archiver('zip')

  output.on('close', () => {
    console.log(archive.pointer() + ' total bytes')
    console.log('archiver has been finalized and the output file descriptor has closed.')
  })

  output.on('end', function () {
    console.log('Data has been drained')
  })

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

  archive.directory('public/output/', 'new-subdir')

  await archive.finalize()

  return Response.json({ data: 'ok' })
}
