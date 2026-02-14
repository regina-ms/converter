import { getIdFromPath } from '@/features/getIdFromPath'
import { userDir } from '@/methods/userDir'
import { promises as fs } from 'fs'
import { NextRequest, NextResponse } from 'next/server'
import path from 'node:path'

export async function POST(request: NextRequest) {
  let userId = request.cookies.get('guest-id')?.value
  if (!userId) {
    return NextResponse.json({ error: 'Нарушение прав доступа' }, { status: 500 })
  }

  const fileUrl = await request.text()
  const fileId = getIdFromPath(fileUrl)
  const filePath = path.join(userDir(userId), fileId)
  if (!filePath.startsWith(userDir(userId))) {
    return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 })
  }

  try {
    await fs.access(filePath)
  } catch {
    return NextResponse.json({ error: 'Изображение не найдено' }, { status: 404 })
  }

  const metaPath = `${filePath}.json`
  await fs.unlink(filePath)
  await fs.unlink(metaPath)

  return NextResponse.json({ success: 'Удалено успешно' }, { status: 200 })
}
