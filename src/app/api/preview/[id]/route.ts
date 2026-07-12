import { imagesFolder } from '@/methods/userDir'
import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import { createReadStream } from 'node:fs'
import path from 'node:path'
import { COOKIE_ID, USER_RAW_IMAGES_FOLDER } from '@/constants'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const userId = request.cookies.get(COOKIE_ID)?.value

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const filePath = path.join(imagesFolder(userId, USER_RAW_IMAGES_FOLDER), id)

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
