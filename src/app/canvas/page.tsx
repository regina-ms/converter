'use client'
import React from 'react'
import { Box } from '@mui/material'
import { useImageCropper } from '@/useImageCropper'
import Button from '@mui/material/Button'

function Page() {
  const { staticCanvasRef, dynamicCanvasRef, onMouseLeave, onMouseUp, onMouseMove, onMouseDown, crop } =
    useImageCropper('/test-vert.jpg')

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
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
        ></canvas>
      </Box>
      <Button onClick={crop}>Обрезать</Button>
    </>
  )
}

export default Page
