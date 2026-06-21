import { SavedImage } from '@/methods/uploadFiles'
import { userDir } from '@/methods/userDir'
import { promises as fs } from 'fs'
import path from 'node:path'
import sharp from 'sharp'

export async function getUserImages(userId: string): Promise<SavedImage[]> {
  const userImagesList = await fs.readdir(userDir(userId))
  if (!userImagesList.length) return []

  return await Promise.all(
    userImagesList
      .filter((imageName) => path.extname(imageName) !== '.json')
      .map(async (imageName) => {
        const imagePath = path.join(userDir(userId), imageName)
        const url = `/api/preview/${imageName}`
        const buffer = await fs.readFile(imagePath)
        const size = buffer.length
        const metadata = await sharp(buffer).metadata()
        const { width, height } = metadata
        return { url, width, height, size, name: imageName }
      }),
  )
}
