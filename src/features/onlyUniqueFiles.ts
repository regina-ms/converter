import { SavedImage } from '@/methods/uploadFiles'

export function onlyUniqueFiles(existingImages: SavedImage[], files: File[]) {
  const namesMap = new Map<string, string>()
  existingImages.forEach((image) => namesMap.set(image.name, image.name))
  return files.filter((file) => !namesMap.has(file.name))
}
