import { CustomError } from '@/methods/uploadFiles'

type ResponseT = Promise<CustomError | { success: string }>

export async function deleteFile(fileUrl: string): ResponseT {
  const response = await fetch('/api/delete', { method: 'POST', body: fileUrl })
  return await response.json()
}
