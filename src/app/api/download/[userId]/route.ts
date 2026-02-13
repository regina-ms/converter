import { userDir } from '@/methods/userDir'
import { NextRequest, NextResponse } from 'next/server'
import { createReadStream } from 'node:fs'
import path from 'node:path'
import { promises as fs } from 'fs'

export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  console.log(userId)
  const archivePath = path.join(userDir(userId), 'converter.zip')

  if (!archivePath.includes(userId) || !archivePath.endsWith('.zip')) {
    return NextResponse.json('Not found', { status: 404 })
  }

  try {
    const stream = createReadStream(archivePath)
    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment`,
      },
    })
  } catch {
    return NextResponse.json('File not found', { status: 404 })
  }
}
