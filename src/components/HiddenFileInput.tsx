'use client'
import { ActionContext } from '@/features/ActionContext'
import { getFileData } from '@/methods/getFileData'
import React, { useContext, useRef, useState } from 'react'
import { Box, Typography } from '@mui/material'
import Button from '@mui/material/Button'

export function HiddenFileInput() {
  const [error, setError] = useState<string>()
  const [activeButton, setActiveButton] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const ref = useRef<HTMLInputElement>(null)
  const { setInputFiles, inputFiles } = useContext(ActionContext)

  const onDragOver = () => {
    setActiveButton(true)
  }
  const onDragLeave = () => {
    setActiveButton(false)
  }

  const onDrop = () => {
    setActiveButton(false)
  }

  const onFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setLoading(true)
    const result = await getFileData([...e.target.files])
    if ('error' in result) {
      setError(result.error)
    } else {
      setInputFiles(inputFiles.concat(result))
    }
    setLoading(false)
  }

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: inputFiles.length ? 'fit-content' : '100%',
        marginY: 5,
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
        loading={loading}
      >
        Загрузить изображение
      </Button>
      {error && (
        <Typography marginTop={1} color='error'>
          {error}
        </Typography>
      )}
    </Box>
  )
}
