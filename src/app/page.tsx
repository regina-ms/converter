'use client'

import React, { useState } from 'react'
import { sendFiles } from '@/app/methods/sendFiles'
import InputFile from '@/app/components/InputFile'
import { getFiles } from '@/app/methods/getFiles'
import Image from 'next/image'


export default function Page() {
  const [files, setFiles] = useState<string[]>([])
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    sendFiles([...e.target.files]).then(() => {
      getFiles().then((res) => setFiles(() => {
        return res.data.map((path) => `/data/${path}`)
      }))
    })
  }

  function showImages() {
    return files.map((image, index) => <Image key={index} src={image} alt={''} width={500} height={500} className={`size-[200px] object-center object-cover`}/>)
  }

  if (!files.length) return <InputFile onChange={onChange} />

  return (
    <div className={`size-full h-svh flex`}>
      <div className={`flex size-full max-w-[240px] flex-col gap-[10px] border-r border-l-base-button-green p-[15px]`}>
        <div className={`flex flex-col gap-[4px]`}>
          <div className={`font-roboto_condensed text-header-100`}>Особые:</div>
          <button className={`rounded-[6px] bg-base-button-yellow py-[3px] text-base-200 text-base-white`}>
            Сохранить
          </button>
        </div>
        <div className={`flex flex-col gap-[4px]`}>
          <div className={`font-roboto_condensed text-header-100`}>Манипулирование</div>
          <ul className={`flex flex-col gap-[5px] text-base-200 text-base-white`}>
            <li>
              <button className={`w-full rounded-[6px] bg-base-button-green py-[3px] text-base-200 text-base-white`}>
                Конвертировать
              </button>
            </li>
            <li>
              <button className={`w-full rounded-[6px] bg-base-button-green py-[3px] text-base-200 text-base-white`}>
                Масштабировать
              </button>
            </li>
            <li>
              <button className={`w-full rounded-[6px] bg-base-button-green py-[3px] text-base-200 text-base-white`}>
                Сжать
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className={`w-full border-r-base-button-green`}>
        <div className={`flex items-center gap-[10px] flex-wrap`}>
          {showImages()}
        </div>

      </div>
      <div className={`max-w-[400px] w-full bg-base-button-brown`}>

      </div>
    </div>
  )
}
