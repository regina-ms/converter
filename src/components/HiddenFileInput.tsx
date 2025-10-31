import React, { useRef, useState } from 'react'
import { Box } from '@mui/material'
import Button from '@mui/material/Button'

interface Props {
  onFileInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  width?: string
  height?: string
}

export function HiddenFileInput({ onFileInputChange, width, height }: Props) {
  const [activeButton, setActiveButton] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    setActiveButton(true)
  }
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    setActiveButton(false)
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    setActiveButton(false)
  }

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width,
        height,
      }}
    >
      <input
        type='file'
        multiple
        style={{ position: 'absolute', inset: 0, opacity: 0 }}
        onDragEnter={onDragOver}
        onDragLeave={onDragLeave}
        onChange={onFileInputChange}
        onDrop={onDrop}
        ref={ref}
      />
      <Button
        variant='contained'
        size='large'
        sx={{ boxShadow: activeButton ? 10 : 0, backgroundColor: activeButton ? 'success.main' : 'primary.main' }}
        onClick={() => ref.current && ref.current.click()}
      >
        Загрузить изображение
      </Button>
    </Box>
  )
}
