'use client'

import React, { useEffect, useState } from 'react'
import { sendFiles } from '@/methods/sendFiles'
import InputFile from '@/components/InputFile'
import { getFiles } from '@/methods/getFiles'
import Manipulations from '@/components/Manipulations'
import { ManipulationContextProvider } from '@/features/ManipulationContext'

export default function Page() {
  const [files, setFiles] = useState<string[]>([])

  const setFilesToState = async () => {
    const res = await getFiles()
    return setFiles(() => {
      return res.data.map((path) => `/data/${path}`)
    })
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    sendFiles([...e.target.files]).then(async () => await setFilesToState())
  }

  useEffect(() => {
    setFilesToState()
  }, [])

  if (!files.length) return <InputFile onChange={onChange} />

  return (
    <ManipulationContextProvider>
      <Manipulations files={files} />
    </ManipulationContextProvider>
  )
}
