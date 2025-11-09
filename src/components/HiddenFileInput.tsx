'use client'
import { ActionContext } from '@/features/ActionContext'
import { writeFiles } from '@/methods/writeFiles'
import React, { useContext, useRef, useState } from 'react'
import { Box } from '@mui/material'
import Button from '@mui/material/Button'

export function HiddenFileInput() {
  const [activeButton, setActiveButton] = useState(false)
  const ref = useRef<HTMLInputElement>(null)
    const { input } = useContext(ActionContext)

  const onDragOver = () => {
    setActiveButton(true)
  }
  const onDragLeave = () => {
    setActiveButton(false)
  }

  const onDrop = () => {
    setActiveButton(false)
  }

    const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        writeFiles([...e.target.files]).then(input.set)
    }

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
          height: input.data.length ? 'fit-content' : '100%',
          marginY: 5
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
