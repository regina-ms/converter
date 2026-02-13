'use client'
import Convert from '@/components/Convert'
import Resize from '@/components/Resize'
import { ActionContext } from '@/features/ActionContext'
import { Stack, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import DownloadIcon from '@mui/icons-material/Download'

import { useContext, useState } from 'react'

function Actions() {
  const { actions, rawImages } = useContext(ActionContext)
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)
  const [url, setUrl] = useState<string>()

  const goActions = async () => {
    setLoading(true)
    const res = await fetch('/api/transform', { method: 'POST', body: JSON.stringify({ rawImages, actions }) })
    const { url } = await res.json()
    setUrl(url)
    setLoading(false)
  }

  const removeLink = () => setUrl(undefined)

  if (!rawImages.length) return null
  return (
    <>
      <Stack marginTop={6} marginBottom={4} direction='row' justifyContent='space-between' alignItems='start'>
        <Convert />
        <Resize />
      </Stack>
      <Button variant='outlined' size='large' sx={{ width: 'fit-content' }} onClick={goActions} loading={loading}>
        Поехали!
      </Button>
      {error && <Typography color='error'>{error}</Typography>}
      {url && (
        <Button
          onClick={() => removeLink()}
          endIcon={<DownloadIcon />}
          download='converted-images.zip'
          href={url}
          sx={{ marginLeft: 2 }}
        >
          Скачать архив
        </Button>
      )}
    </>
  )
}

export default Actions
