import { promises as fs } from 'fs'

export async function deleteDir(path: string) {
  try {
    await fs.rm(path, { force: true, recursive: true })
  } catch {
    throw new Error('Ошибка удаления преобразованных файлов')
  }
}
