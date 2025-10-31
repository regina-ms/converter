'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { ImageData } from '@/app/api/get-files/route'
import { Box, ImageList, ImageListItem } from '@mui/material'
import theme from '@/theme'
import Button from '@mui/material/Button'

interface Props {
  files: ImageData[]
  deleteFile?: (fileName: string) => void
}

const _ImageListItem = ({ image, deleteFile }: { image: ImageData; deleteFile?: (fileName: string) => void }) => {
  const [showDetail, setShowDetail] = useState<boolean>(false)

  const onMouseEnter = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setShowDetail(true)
  }

  const onMouseLeave = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setShowDetail(false)
  }

  const onDeleteButtonCLick = (fileName: string) => {
    deleteFile && deleteFile(fileName)
  }

  return (
    <ImageListItem
      sx={{ position: 'relative', overflow: 'hidden' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Image
        src={image.name}
        alt={image.name}
        width={image.width}
        height={300}
        loading={'lazy'}
        style={{ objectFit: 'cover', width: '100%' }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          padding: theme.spacing(2),
          color: theme.palette.primary.contrastText,
          transform: showDetail ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 300ms linear',

          '::after': {
            content: '""',
            display: 'block',
            position: 'absolute',
            inset: 0,
            backgroundColor: theme.palette.primary.dark,
            opacity: 0.3,
            zIndex: -1,
          },
        }}
      >
        <Button
          variant={'outlined'}
          onClick={() => onDeleteButtonCLick(image.name)}
          sx={{ color: theme.palette.primary.contrastText }}
        >
          Удалить
        </Button>
        <div>{`Формат: ${image.format}`}</div>
        <div>{`Размер: ${image.size}`}</div>
        <div>{`Ширина: ${image.width}`}</div>
        <div>{`Высота: ${image.height}`}</div>
      </Box>
    </ImageListItem>
  )
}

function FileList({ files, deleteFile }: Props) {
  function showImages() {
    return files.map((image, index) => <_ImageListItem image={image} key={index} deleteFile={deleteFile} />)
  }

  return (
    <ImageList cols={files.length < 5 ? files.length : 5} sx={{ maxHeight: '610px', overflowY: 'auto' }}>
      {showImages()}
    </ImageList>
  )
}

export default FileList
