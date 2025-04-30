'use client'
import React, { useContext, useEffect, useState } from 'react'
import { getFiles } from '@/methods/getFiles'
import { writeFiles } from '@/methods/writeFiles'
import Actions from '@/components/Actions'
import InputFiles from '@/components/InputFiles'
import { ImageData } from '@/app/api/get-files/route'
import { PATHS, PUBLIC_PATHS } from '@/constants'
import { ActionOptions } from '@/components/ActionOptions'
import { ActionContext } from '@/features/ActionContext'
import Input from '@/components/Input'

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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    writeFiles([...e.target.files]).then(input.set)
  }

  if (!input.data.length) return <Input onChange={onChange} />

  return (
    <div className={`flex size-full h-svh`}>
      {/*<Actions />*/}
      <div className={`w-full border-l border-r border-l-base-button-green border-r-base-button-green p-[15px]`}>
        <InputFiles files={imageData} />
      </div>
      {/*<ActionOptions />*/}
    </div>
  )
}
