import { Buffer } from 'node:buffer'
import fsAsync from 'node:fs/promises'

export async function POST(request: Request) {
  const formData = await request.formData()
  const response = {
    status: 'yes',
  }
  formData.forEach((data) => {
    if (typeof data === 'string') return
    const file = data as File
    file.arrayBuffer().then(async (res) => {
      const buffer = Buffer.from(res)
      try {
        await fsAsync.writeFile(`${formData.get('path')}/${file.name}`, buffer)
      } catch {
        response.status = 'error'
      }
    })
  })

  return Response.json(response)
}
