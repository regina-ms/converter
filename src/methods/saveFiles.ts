
export async function saveFiles(files:File[]) {
    console.log(files)
    const formData = new FormData()
    files.forEach((file, index) => formData.append(`image-${index}`, file))
    let data:any

    return await fetch('/api/save-files', {
        method: 'POST',
        body: formData,
    })
}