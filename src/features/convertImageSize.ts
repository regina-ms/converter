export function convertImageSize(sizeInBytes: number | undefined): string {
  if (!sizeInBytes) return '0'
  const sizeName = sizeInBytes >= 1048576 ? 'MB' : 'KB'
  return `${sizeName === 'MB' ? (sizeInBytes / 1048576).toFixed(2) : (sizeInBytes / 1024).toFixed(2)}` + sizeName
}
