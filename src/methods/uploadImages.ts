export type SavedImage = {
  url: string
  name: string
  size: number
}

export type CustomError = {
  error: string
  details: any
}

type Response = Promise<{ saved: SavedImage[] } | CustomError>

export async function uploadImages(files: File[]): Promise<Response> {
  const formData = new FormData()
  files.forEach((file) => formData.append('images', file, file.name))

  const res = await fetch('/api/upload', { method: 'POST', body: formData })

  return await res.json()
}
