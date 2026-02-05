import { userDir } from '@/methods/userDir'
import { promises as fs } from 'fs'
import { FORMATS } from '@/actionsTypes'
import path from 'node:path'
import { v4 } from 'uuid'

export type SaveFilesArgs = {
  userId: string
  buffer: Buffer
  ext: keyof typeof FORMATS
}

export async function saveFiles({ userId, buffer, ext }: SaveFilesArgs) {
  await fs.mkdir(userDir(userId), { recursive: true })
  const imageId = v4()
  const imageName = `${Date.now()}_${imageId}.${ext}`
  const imagePath = path.join(userDir(userId), imageName)
  await fs.writeFile(imagePath, buffer)

  await fs.writeFile(`${imagePath}.json`, JSON.stringify({ createdAt: Date.now(), originalName: imageName }))

  return `/api/preview/${imageName}`
}
