import { userDir } from '@/methods/userDir'
import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import { createReadStream } from 'node:fs'
import path from 'node:path'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const userId = request.cookies.get('guest-id')?.value

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const filePath = path.join(userDir(userId), id)
  if (!filePath.startsWith(userDir(userId))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    await fs.access(filePath)
  } catch {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 })
  }

  const ext = path.extname(filePath).slice(1)
  const contentType = `image/${ext}`
  const stream = createReadStream(filePath)
  return new NextResponse(stream as any, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
