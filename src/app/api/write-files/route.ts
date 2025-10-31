import { Buffer } from 'node:buffer'
import fsAsync from 'node:fs/promises'
import path from 'node:path'

async function uniqueName(dir: string, fileName: string): Promise<string> {
  const { name, ext } = path.parse(fileName)

  let uniqueFileName = fileName
  let counter = 1

  while (true) {
    try {
      await fsAsync.access(path.join(dir, uniqueFileName))
      uniqueFileName = `${name} (${counter})${ext}`
      counter++
    } catch {
      return uniqueFileName
    }
  }
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const response = {
    status: 'ok',
  }

  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') return

    const file = value as File

    const buffer = Buffer.from(await file.arrayBuffer())
    const dir = formData.get('path') as string
    const name = await uniqueName(dir, file.name)
    const fullPath = path.join(dir, name)
    try {
      await fsAsync.writeFile(fullPath, buffer)
    } catch {
      response.status = 'error'
    } finally {
    }
  }

  return Response.json(response)
}
