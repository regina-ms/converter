import { Body } from '@/app/api/transform-files/types'

export async function transformFiles({fileNames, actions}: Body) {
  return await fetch('/api/transform-files', {
    method: 'POST',
    body: JSON.stringify({fileNames, actions}),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
