'use client'
import { ActionContext } from '@/features/ActionContext'
import { convertImageSize } from '@/features/convertImageSize'
import { deleteFile } from '@/methods/deleteFile'
import { SavedImage } from '@/methods/uploadFiles'
import Button from '@mui/material/Button'
import React, { useContext, useState } from 'react'
import Image from 'next/image'
import { Box, ImageList, ImageListItem, Typography } from '@mui/material'
import theme from '@/theme'
import styles from './FileList.module.css'

const CustomListItem = ({ file, deleteImage }: { file: SavedImage; deleteImage: (fileUrl: string) => void }) => {
  const [error, setError] = useState<string>()

  const deleteImageHandle = async (fileUrl: string) => {
    const response = await deleteFile(fileUrl)
    if ('error' in response) {
      setError(response.error)
      return
    }
    deleteImage(fileUrl)
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
        <Typography>{`Размер: ${convertImageSize(file.size)}`}</Typography>
        <Typography>{`Высота: ${file.height}`}</Typography>
        <Typography>{`Ширина: ${file.width}`}</Typography>
        <Button onClick={() => deleteImageHandle(file.url)}>Удалить</Button>
        {error && <Typography color='error'>{error}</Typography>}
      </Box>
    </ImageListItem>
  )
}

function FileList() {
  const { rawImages, deleteImage } = useContext(ActionContext)

  function showImages() {
    return rawImages.map((file, index) => <CustomListItem file={file} key={index} deleteImage={deleteImage} />)
  }

  return (
    <ImageList cols={3} rowHeight={500} sx={{ maxHeight: '610px', overflowY: 'auto' }}>
      {showImages()}
    </ImageList>
  )
}

export default FileList
