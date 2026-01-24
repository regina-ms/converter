'use client'
import { ActionContext } from '@/features/ActionContext'
import React, { useContext } from 'react'
import Image from 'next/image'
import { Box, ImageList, ImageListItem } from '@mui/material'
import theme from '@/theme'
import Button from '@mui/material/Button'
import styles from './FileList.module.css'
import {ImageData} from '@/app/api/get-file-data/route'

const CustomListItem = ({ file, removeFile }: { file: ImageData; removeFile: (dataUrl: string) => void }) => {

  return (
    <ImageListItem className={styles.imageItem}>
      <Image
        src={file.dataUrl}
        alt={file.name}
        width={file.width}
        height={file.height}
        loading='lazy'
        className={styles.image}
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
        <Button variant='outlined' sx={{ color: theme.palette.primary.contrastText }} onClick={() => removeFile(file.dataUrl)}>
          Удалить
        </Button>
        <div>{`Формат: ${file.format}`}</div>
        <div>{`Размер: ${file.size}`}</div>
        <div>{`Ширина: ${file.width}`}</div>
        <div>{`Высота: ${file.height}`}</div>
      </Box>
    </ImageListItem>
  )
}

function FileList() {
  const { inputFiles, removeInputFile } = useContext(ActionContext)

  function showImages() {
    return inputFiles.map((file, index) => <CustomListItem file={file} key={index} removeFile={removeInputFile} />)
  }

  return (
    <ImageList cols={3} rowHeight={500} sx={{ maxHeight: '610px', overflowY: 'auto' }}>
      {showImages()}
    </ImageList>
  )
}

export default FileList
