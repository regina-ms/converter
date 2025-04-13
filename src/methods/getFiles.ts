import { PUBLIC_PATHS } from '@/constants'
import { ImageData } from '@/app/api/get-files/route'

export async function getFiles(path: string = PUBLIC_PATHS.input): Promise<{ data: ImageData[] }> {
  const searchParams = new URLSearchParams()
  searchParams.set('path', path)

  const res = await fetch(`/api/get-files?${searchParams.toString()}`)
  return res.json()
}
