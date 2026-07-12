import { createSession } from '@/features/session'
import { saveFiles } from '@/methods/saveFiles'
import { SavedImage } from '@/methods/uploadFiles'
import { NextRequest, NextResponse } from 'next/server'
import path from 'node:path'
import sharp from 'sharp'
import { COOKIE_ID } from '@/constants'

export async function POST(request: NextRequest) {
  let userId = request.cookies.get(COOKIE_ID)?.value
  if (!userId) userId = await createSession()

  try {
    const formData = await request.formData()
    const images = formData.getAll('images') as File[]

    const saved: SavedImage[] = await Promise.all(
      images.map(async (image) => {
        const bytes = await image.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const ext = path.extname(image.name).slice(1)
        const url = await saveFiles({ userId, buffer, ext })
        const metadata = await sharp(buffer).metadata()
        const { width, height } = metadata
        return { url, name: image.name, size: image.size, width, height, ext }
      }),
    )

    return NextResponse.json([...saved])
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
