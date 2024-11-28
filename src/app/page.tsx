'use client'

import React, { useEffect, useState } from 'react'
import { sendFiles } from '@/app/methods/sendFiles'
import InputFile from '@/app/components/InputFile'
import { getFiles } from '@/app/methods/getFiles'
import Image from 'next/image'
import ActionButtons from '@/app/components/ActionButtons'

const BUTTON_VALUES = ''

export default function Page() {
  const [files, setFiles] = useState<string[]>([])
  const [manipulation, setManipulation] = useState()
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

  function showImages() {
    return files.map((image, index) => (
      <Image
        key={index}
        src={image}
        alt={''}
        width={500}
        height={500}
        className={`size-[200px] object-cover object-center`}
      />
    ))
  }

  if (!files.length) return <InputFile onChange={onChange} />

  return (
    <div className={`flex size-full h-svh`}>
      <div className={`flex size-full max-w-[240px] flex-col gap-[10px] border-r border-l-base-button-green p-[15px]`}>
        <div className={`flex flex-col gap-[4px]`}>
          <div className={`font-roboto_condensed text-header-100`}>Особые:</div>
          <button className={`rounded-[6px] bg-base-button-yellow py-[3px] text-base-200 text-base-white`}>
            Сохранить
          </button>
        </div>
        <div className={`flex flex-col gap-[4px]`}>
          <div className={`font-roboto_condensed text-header-100`}>Манипулирование</div>
        </div>
      </div>

      <div className={`w-full border-r-base-button-green`}>
        <div className={`flex flex-wrap items-center gap-[10px]`}>{showImages()}</div>
      </div>
      <div className={`w-full max-w-[400px] bg-base-button-brown`}></div>
    </div>
  )
}
