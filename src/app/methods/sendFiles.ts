export async function sendFiles(files: File[]) {
  if (!files.length) return
  const data = new FormData()
  files.forEach((file, index) => data.append(`file-${index}`, file))

  const res = await fetch('/api/write-files', {
    method: 'POST',
    body: data,
  })
  return res.json()
}
