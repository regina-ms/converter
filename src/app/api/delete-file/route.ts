import { unlink } from 'node:fs/promises'
import { NextRequest } from 'next/server'
import * as path from 'path'
import { PUBLIC_FOLDER } from '@/constants'

export async function POST(request: NextRequest) {
  const response = {
    status: 'yes',
  }

  const _path = path.join(process.cwd(), PUBLIC_FOLDER, await request.text())

  try {
    await unlink(_path)
  } catch (error: any) {
    response.status = `error: ${error.message}`
  } finally {
    console.log(response.status)
  }

  return Response.json(response)
}
