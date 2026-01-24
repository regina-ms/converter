import {ImageData} from '@/app/api/get-file-data/route'

type GetFileData = ImageData[] | {error: string}

export async function getFileData(files: File[]):Promise<GetFileData> {
  const formData = new FormData()
  files.forEach((file, index) => formData.append(`image-${index}`, file, `${file.name}`))
  const res = await fetch('/api/get-file-data', {
    method: 'POST',
    body: formData,
  })

  if(!res.ok) return { error: 'не удалось загрузить изображение'}

  const {data} = await res.json()

  return data
}
