'use client'
import { ActionContext } from '@/features/ActionContext'
import { SavedImage } from '@/methods/uploadImages'
import React, { useContext } from 'react'
import Image from 'next/image'
import { Box, ImageList, ImageListItem } from '@mui/material'
import theme from '@/theme'
import styles from './FileList.module.css'

const CustomListItem = ({ file, removeFile }: { file: SavedImage; removeFile: (dataUrl: string) => void }) => {
  return (
    <ImageListItem className={styles.imageItem}>
      <Image src={file.url} alt={file.name} width={100} height={100} loading='lazy' className={styles.image} />
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
