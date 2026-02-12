import { Action } from '@/actionsTypes'
import { SavedImage } from '@/methods/uploadImages'

type TransformFilesArgs = {
  files: SavedImage[]
  actions: Action<'convert' | 'resize'>[]
}

export async function transformFiles({ files, actions }: TransformFilesArgs) {
  const res = await fetch('/api/transform-files', {
    method: 'POST',
    body: JSON.stringify({ files, actions }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    return { error: res.statusText }
  }

  const { data } = await res.json()

  return data
}
