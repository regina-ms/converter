import { userDir } from '@/methods/userDir'
import path from 'node:path'

type Args = {
  userId: string
  imageName: string
}

export async function getFile({ userId, imageName }: Args) {
  const imagePath = path.join(userDir(userId), imageName)

  if (!imagePath.startsWith(userDir(userId))) {
    throw new Error('invalid path')
  }

  return imagePath
}
