import { ARCHIVE_NAME } from '@/constants'
import { userDir } from '@/methods/userDir'
import { promises as fs } from 'fs'
import path from 'node:path'

type Args = {
  userId: string
  maxAge?: number
}

export async function cleanupOld({ userId, maxAge = 24 * 60 * 60 * 1000 }: Args) {
  const dir = userDir(userId)
  const archive = path.join(dir, ARCHIVE_NAME)
  await fs.rm(archive, { force: true, recursive: true })

  try {
    const images = await fs.readdir(dir)
    const now = Date.now()
    for (const image of images) {
      if (image.endsWith('.json')) continue

      const metaPath = path.join(dir, `${image}.json`)
      const meta = JSON.parse(await fs.readFile(metaPath, { encoding: 'utf-8' }))

      if (now - meta.createdAt > maxAge) {
        await fs.unlink(path.join(dir, image))
        await fs.unlink(metaPath)
      }
    }
  } catch {}
}
