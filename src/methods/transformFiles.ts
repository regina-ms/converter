import { Action } from '@/actionsTypes'
import { ImageData, LikeBufferObject } from '@/app/api/get-file-data/route'

export type TransformedFile = Pick<ImageData, 'name' | 'format'> & { originalBuffer: LikeBufferObject }

type TransformFilesData = TransformedFile[] | { error: string }

type TransformFilesArgs = {
  files: ImageData[]
  actions: Action<'convert' | 'resize'>[]
}

export async function transformFiles({ files, actions }: TransformFilesArgs): Promise<TransformFilesData> {
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
