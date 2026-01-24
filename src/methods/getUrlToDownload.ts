import { TransformedFile } from '@/methods/transformFiles'
import JSZip from 'jszip'

export async function getUrlToDownload(files: TransformedFile[]) {
    const zip = new JSZip()

    files.forEach((file) => {
        const buffer = Buffer.from(file.originalBuffer.data)
        zip.file(file.name, buffer)
    })

    const content = await zip.generateAsync({ type: 'blob' })
    return URL.createObjectURL(content)
}
