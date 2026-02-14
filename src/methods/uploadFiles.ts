export type SavedImage = {
  url: string
  name: string
  size: number
  width?: number
  height?: number
}

export type CustomError = {
  error: string
}

type ResponseT = Promise<SavedImage[] | CustomError>

export async function uploadFiles(files: File[]): Promise<ResponseT> {
  const formData = new FormData()
  files.forEach((file) => formData.append('images', file, file.name))

  const res = await fetch('/api/upload', { method: 'POST', body: formData })

  return await res.json()
}
