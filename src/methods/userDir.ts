import { UPLOAD_DIR } from '@/constants'
import path from 'node:path'

export function userDir(userId: string) {
  return path.join(UPLOAD_DIR, userId)
}

export function imagesFolder(userId: string, type: 'raw' | 'transformed') {
  return path.join(UPLOAD_DIR, userId, type)
}
