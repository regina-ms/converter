export async function getFileData(files: File[]) {
  const formData = new FormData()
  files.forEach((file, index) => formData.append(`image-${index}`, file, `${file.name}`))

  return await fetch('/api/get-file-data', {
    method: 'POST',
    body: formData,
  })
}
