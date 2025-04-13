import { PUBLIC_PATHS } from '@/constants'

export async function writeFiles(files: File[], path: string = PUBLIC_PATHS.input) {
  if (!files.length) return
  const data = new FormData()
  files.forEach((file, index) => data.append(`file-${index}`, file))
  data.append('path', path)

  const res = await fetch('/api/write-files', {
    method: 'POST',
    body: data,
  })
  return res.json()
}
