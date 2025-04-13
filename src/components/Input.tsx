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

function Input() {
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
    writeFiles([...e.target.files]).then(() => input.set())
  }

  if (!input.data.length)
    return (
      <div className={`flex h-svh w-full items-center justify-center`}>
        <div className='relative flex h-[350px] w-full max-w-[600px] items-center justify-center rounded-[18px] border border-base-border'>
          <input
            type='file'
            accept={'image/*'}
            multiple
            className='absolute inset-0 size-full cursor-pointer opacity-0'
            onChange={onChange}
          />
          <div className='w-full max-w-[290px] text-center text-base-100'>
            Нажмите или перенесите, чтобы добавить фотографии
          </div>
        </div>
      </div>
    )

  return (
    <div className={`flex size-full h-svh`}>
      <Actions />
      <div className={`w-full border-l border-r border-l-base-button-green border-r-base-button-green p-[15px]`}>
        <InputFiles files={imageData} />
      </div>
      <ActionOptions />
    </div>
  )
}

export default Input
