import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
    const a = await request.formData()
    console.log({a})



    return Response.json({status: 'ok'})
}