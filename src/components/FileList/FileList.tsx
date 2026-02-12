'use client'
import { ActionContext } from '@/features/ActionContext'
import { SavedImage } from '@/methods/uploadImages'
import Button from '@mui/material/Button'
import React, { useContext, useState } from 'react'
import Image from 'next/image'
import { Box, ImageList, ImageListItem, Typography } from '@mui/material'
import theme from '@/theme'
import styles from './FileList.module.css'

const CustomListItem = ({ file, deleteFile }: { file: SavedImage; deleteFile: (fileUrl: string) => void }) => {
  const [error, setError] = useState<string>()

  const removeFileHandle = async (fileUrl: string) => {
    try {
      await fetch('/api/delete', { method: 'POST', body: fileUrl })
      deleteFile(fileUrl)
    } catch {
      setError('ошибка удаления')
    }
  }
  return (
    <ImageListItem className={styles.imageItem}>
      <Image
        src={file.url}
        alt={file.name}
        width={100}
        height={100}
        loading='lazy'
        className={styles.image}
        unoptimized
      />
      <Box
        className={styles.imageInfo}
        sx={{
          padding: theme.spacing(2),
          color: theme.palette.primary.contrastText,
          '::after': {
            backgroundColor: theme.palette.primary.dark,
          },
        }}
      >
        <div>{`Размер: ${file.size}`}</div>
        <Button onClick={() => removeFileHandle(file.url)}>Удалить</Button>
        {error && <Typography>{error}</Typography>}
      </Box>
    </ImageListItem>
  )
}

function FileList() {
  const { rawImages, deleteFile } = useContext(ActionContext)

  function showImages() {
    return rawImages.map((file, index) => <CustomListItem file={file} key={index} deleteFile={deleteFile} />)
  }

  return (
    <ImageList cols={3} rowHeight={500} sx={{ maxHeight: '610px', overflowY: 'auto' }}>
      {showImages()}
    </ImageList>
  )
}

export default FileList
