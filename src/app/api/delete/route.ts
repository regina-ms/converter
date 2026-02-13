import { getIdFromPath } from '@/features/getIdFromPath'
import { userDir } from '@/methods/userDir'
import { promises as fs } from 'fs'
import { NextRequest, NextResponse } from 'next/server'
import path from 'node:path'

export async function POST(request: NextRequest) {
  let userId = request.cookies.get('guest-id')?.value
  if (!userId) {
    return NextResponse.json('Unauthorized', { status: 401 })
  }

  const fileUrl = await request.text()
  const fileId = getIdFromPath(fileUrl)

  const filePath = path.join(userDir(userId), fileId)
  if (!filePath.startsWith(userDir(userId))) {
    return NextResponse.json('Forbidden', { status: 403 })
  }

  try {
    await fs.access(filePath)
  } catch {
    return NextResponse.json('Not Fount', { status: 404 })
  }

  const metaPath = `${filePath}.json`

  await fs.unlink(filePath)
  await fs.unlink(metaPath)

  return NextResponse.json({ data: 'ok' })
}
