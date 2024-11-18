import fs from 'node:fs'

export async function GET() {
    const data = fs.readdirSync('public/data')
    return Response.json({ data })
}
