export function getIdFromPath(path: string) {
  const split = path.split('/')
  return split[split.length - 1]
}
