import { SavedImage } from '@/methods/uploadFiles'
import { imagesFolder } from '@/methods/userDir'
import { promises as fs } from 'fs'
import path from 'node:path'
import sharp from 'sharp'
import { USER_RAW_IMAGES_FOLDER } from '@/constants'

export async function getRawUserImages(userId: string): Promise<SavedImage[]> {
  const imagesFolderPath = path.join(imagesFolder(userId, USER_RAW_IMAGES_FOLDER))
  const userImagesList = await fs.readdir(imagesFolderPath)
  if (!userImagesList.length) return []

  return await Promise.all(
    userImagesList
      .filter((imageName) => path.extname(imageName) !== '.json')
      .map(async (imageName) => {
        const imagePath = path.join(imagesFolderPath, imageName)
        const url = `/api/preview/${imageName}`
        const buffer = await fs.readFile(imagePath)
        const size = buffer.length
        const metadata = await sharp(buffer).metadata()
        const { width, height } = metadata
        return { url, width, height, size, name: imageName, ext: metadata.format }
      }),
  )
}
