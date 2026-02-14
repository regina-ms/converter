import { Action } from '@/actionsTypes'
import { CustomError, SavedImage } from '@/methods/uploadFiles'

type ResponseT = Promise<CustomError | { href: string }>

export async function transformFiles(rawImages: SavedImage[], actions: Action<'convert' | 'resize'>[]): ResponseT {
  const res = await fetch('/api/transform', { method: 'POST', body: JSON.stringify({ rawImages, actions }) })
  return await res.json()
}
