'use client'
import React from 'react'
import { Box } from '@mui/material'
import { useImageCropper } from '@/useImageCropper'
import Button from '@mui/material/Button'

function Page() {
  const {
    staticCanvasRef,
    dynamicCanvasRef,
    onPointerUp,
    onPointerMove,
    onPointerDown,
    updateImage,
    imageSrc,
  } = useImageCropper('/test-big.jpg')

  return (
    <>
      <Box position='relative' width='600px' height='90svh' display='flex' justifyContent='center' alignItems='center'>
        <canvas
          ref={staticCanvasRef}
          style={{
            position: 'absolute',
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
          }}
        ></canvas>
        <canvas
          ref={dynamicCanvasRef}
          style={{
            position: 'absolute',
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        ></canvas>
      </Box>
      <Button onClick={() => updateImage()}>Обрезать</Button>
      <Button href={imageSrc} download target='_blank'>
        Скачать
      </Button>
      <Button onClick={() => updateImage(true)}>Вернуть</Button>
    </>
  )
}

export default Page
