export async function archiveFiles() {
  return await fetch('/api/archive-files', {
    method: 'POST',
  })
}
