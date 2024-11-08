import fs, { existsSync } from 'node:fs'
import { Buffer } from 'node:buffer'

export async function POST(request: Request) {
  const formData = await request.formData()
  const response = {
    status: 'ok',
  }
  formData.forEach((data) => {
    const file = data as File
    file.arrayBuffer().then((res) => {
      const buffer = Buffer.from(res)
      try {
        if (!existsSync('data')) {
          fs.mkdirSync('data')
        }
        fs.writeFileSync(`data/${file.name}`, buffer)
      } catch {
        response.status = 'error'
      }
    })
  })

  return Response.json(response)
}
