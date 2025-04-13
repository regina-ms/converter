export async function convertFile(fileName: string, format: string) {
  return await fetch('/api/convert-file', {
    method: 'POST',
    body: JSON.stringify({ format, fileName }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
