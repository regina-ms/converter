export async function getFiles():Promise<{data: string[]}>{
    const res = await fetch('/api/get-files')
    return res.json()
}