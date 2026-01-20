'use client'
import { PATHS, PUBLIC_PATHS } from '@/constants'
import { ActionContext } from '@/features/ActionContext'
import { deleteFile } from '@/methods/deleteFile'
import { getFiles } from '@/methods/getFiles'
import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import { ImageData } from '@/app/api/get-files/route'
import { Box, ImageList, ImageListItem } from '@mui/material'
import theme from '@/theme'
import Button from '@mui/material/Button'

const CustomListItem = ({ image, deleteFile }: { image: ImageData; deleteFile: (fileName: string) => void }) => {
  const [showDetail, setShowDetail] = useState<boolean>(false)

  const onMouseEnter = () => {
    setShowDetail(true)
  }

  const onMouseLeave = () => {
    setShowDetail(false)
  }

  const onDeleteButtonCLick = () => {
    deleteFile(image.name)
  }

  return (
    <ImageListItem
      sx={{ position: 'relative', overflow: 'hidden' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Image
        src={image.dataUrl}
        alt={image.name}
        width={image.width}
        height={300}
        loading='lazy'
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
        <Button variant='outlined' onClick={onDeleteButtonCLick} sx={{ color: theme.palette.primary.contrastText }}>
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

function FileList() {
  const [imageData, setImageData] = useState<ImageData[]>([])
  const { input } = useContext(ActionContext)

  const getImageData = async () => {
    const { data } = await getFiles(PUBLIC_PATHS.input)
    if (!data.length) {
      setImageData([])
      return
    }
    setImageData(() => {
      return data.map((object) => {
        return {
          ...object,
          name: `/${PATHS.input}/${object.name}`,
        }
      })
    })
  }

  const removeFile = (fileName: string) => {
    deleteFile(fileName).then(input.set)
  }

  function showImages() {
    return imageData.map((image, index) => <CustomListItem image={image} key={index} deleteFile={removeFile} />)
  }

  return (
    <ImageList cols={imageData.length < 5 ? imageData.length : 5} sx={{ maxHeight: '610px', overflowY: 'auto' }}>
      {showImages()}
    </ImageList>
  )
}

export default FileList
