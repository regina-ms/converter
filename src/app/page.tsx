'use client'
import React, { useContext, useEffect, useState } from 'react'
import { getFiles } from '@/methods/getFiles'
import { writeFiles } from '@/methods/writeFiles'
import Actions from '@/components/Actions'
import { ImageData } from '@/app/api/get-files/route'
import { PATHS, PUBLIC_PATHS } from '@/constants'
import { ActionContext } from '@/features/ActionContext'
import FileList from '@/components/FileList'
import { deleteFile } from '@/methods/deleteFile'
import { HiddenFileInput } from '@/components/HiddenFileInput'
import { Box } from '@mui/material'

export default function Page() {
  const { input } = useContext(ActionContext)
  const [imageData, setImageData] = useState<ImageData[]>([])

  const getImageData = async () => {
    const { data } = await getFiles(PUBLIC_PATHS.input)
    if (!data.length) return
    setImageData(() => {
      return data.map((object) => {
        return {
          ...object,
          name: `/${PATHS.input}/${object.name}`,
        }
      })
    })
  }

  useEffect(() => {
    getImageData()
  }, [input])

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    writeFiles([...e.target.files]).then(input.set)
  }

  const _deleteFile = (fileName: string) => {
    deleteFile(fileName).then(input.set)
  }

  if (!input.data.length)
    return <HiddenFileInput width={'100%'} height={'100%'} onFileInputChange={onFileInputChange} />

  return (
    <>
      <Box sx={{ marginY: 6 }}>
        <HiddenFileInput onFileInputChange={onFileInputChange} />
        <Actions />
      </Box>

      <FileList files={imageData} deleteFile={_deleteFile} />
    </>
  )
}
