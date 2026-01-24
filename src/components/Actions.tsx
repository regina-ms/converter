'use client'
import Convert from '@/components/Convert'
import Resize from '@/components/Resize'
import { ActionContext } from '@/features/ActionContext'
import { getUrlToDownload } from '@/methods/getUrlToDownload'
import { transformFiles } from '@/methods/transformFiles'
import { Stack, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import DownloadIcon from '@mui/icons-material/Download';

import { useContext, useState } from 'react'

function Actions() {
    const {actions, inputFiles} = useContext(ActionContext)
    const [error, setError] = useState<string>()
    const [url, setUrl] = useState<string>()

    const goActions = async () => {
        const transformedFiles = await transformFiles({files: inputFiles, actions})
        if('error' in transformedFiles) return setError('Ошибка конвертации')
        setUrl(await getUrlToDownload(transformedFiles))
    }

    const removeLink = () => setUrl(undefined)


    if(!inputFiles.length) return null
  return (
    <>
        <Stack marginTop={6} marginBottom={4} direction='row' justifyContent='space-between' alignItems='start'>
            <Convert />
            <Resize/>
        </Stack>
        <Button variant='outlined' size='large' sx={{width: 'fit-content' }} onClick={goActions}>Поехали!</Button>
        {error && <Typography color='error'>{error}</Typography>}
        {url && <Button onClick={() => removeLink()} endIcon={<DownloadIcon/>} download='converted-images.zip' href={url} sx={{marginLeft:2}}>Скачать архив</Button>}

    </>
  )
}

export default Actions
