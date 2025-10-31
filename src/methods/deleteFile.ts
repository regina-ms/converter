export async function deleteFile(filePath: string) {
  const res = await fetch(`/api/delete-file`, {
    method: 'POST',
    body: filePath,
  })
  return res.json()
}
