import { NextRequest } from 'next/server'
import sharp from 'sharp'
import { convertImageSize } from '@/features/convertImageSize'
import { ImageData } from '@/app/api/get-files/route'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    let newImageData = []

    for (const file of formData.values()) {
      const _file = file as File
      const arrayBuffer = await _file.arrayBuffer()
      const originalBuffer = Buffer.from(arrayBuffer)
      const dataUrl = `data:${_file.type};base64,${originalBuffer.toString('base64')}`
      const meta = await sharp(originalBuffer).metadata()
      const size = convertImageSize(meta.size)
      const width = meta.width || 0
      const height = meta.height || 0
      const format = meta.format

      newImageData.push({ dataUrl, originalBuffer, name: _file.name, size, width, height, format })
    }

    return Response.json({ status: 'success', newImageData })
  } catch (e) {
    return Response.json({ status: 'error', newImageData: [] })
  }
}
