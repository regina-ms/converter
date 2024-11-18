import fs, { existsSync } from 'node:fs'
import { Buffer } from 'node:buffer'

export async function POST(request: Request) {
  const formData = await request.formData()
  const response = {
    status: 'yes',
  }
  formData.forEach((data) => {
    const file = data as File
    file.arrayBuffer().then((res) => {
      const buffer = Buffer.from(res)
      try {
        if (!existsSync('public/data')) {
          fs.mkdirSync('public/data')
        }
        fs.writeFileSync(`public/data/${file.name}`, buffer)
      } catch {
        response.status = 'error'
      }
    })
  })

  return Response.json(response)
}
