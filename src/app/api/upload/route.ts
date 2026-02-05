import { FORMATS } from '@/actionsTypes'
import { cleanupOld } from '@/methods/cleanupOld'
import { saveFiles } from '@/methods/saveFiles'
import { SavedImage } from '@/methods/uploadImages'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import path from 'node:path'
import { v4 } from 'uuid'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  let userId = cookieStore.get('guest-id')?.value

  if (!userId) {
    userId = `guest_${v4()}`
    cookieStore.set('guest-id', userId, { httpOnly: true, maxAge: 60 * 60 * 24 })
  }

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

    return NextResponse.json({ saved })
  } catch (err) {
    return NextResponse.json({ error: 'Upload failed', details: (err as Error).message }, { status: 500 })
  }
}
