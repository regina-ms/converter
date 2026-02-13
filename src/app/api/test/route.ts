import { NextResponse } from 'next/server'
import { createReadStream } from 'fs'

export async function GET() {
  const filePath = 'D:\\projects\\regina\\converter\\uploads\\guest_523d7348-1958-4032-8f0c-76e49c146e6d\\converter.zip'
  const stream = createReadStream(filePath)

  return new NextResponse(stream as any, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="test.zip"',
    },
  })
}
