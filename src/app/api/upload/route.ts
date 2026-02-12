import { FORMATS } from '@/actionsTypes'
import { createSession } from '@/features/session'
import { cleanupOld } from '@/methods/cleanupOld'
import { saveFiles } from '@/methods/saveFiles'
import { SavedImage } from '@/methods/uploadImages'
import { NextRequest, NextResponse } from 'next/server'
import path from 'node:path'

export async function POST(request: NextRequest) {
  let userId = request.cookies.get('guest-id')?.value
  if (!userId) userId = await createSession()

  await cleanupOld({ userId })

  try {
    const formData = await request.formData()
    const images = formData.getAll('images') as File[]

    const saved: SavedImage[] = await Promise.all(
      images.map(async (image) => {
        const bytes = await image.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const ext = path.extname(image.name).slice(1) as keyof typeof FORMATS
        const url = await saveFiles({ userId, buffer, ext })
        return { url, name: image.name, size: image.size }
      }),
    )

    return NextResponse.json([...saved])
  } catch (err) {
    return NextResponse.json({ error: 'Upload failed', details: (err as Error).message }, { status: 500 })
  }
}
