import { UPLOAD_DIR } from '@/constants'
import path from 'node:path'

export function userDir(userId: string) {
  return path.join(UPLOAD_DIR, userId)
}
