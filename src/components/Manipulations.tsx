'use client'

import React, { useContext } from 'react'
import ActionButton from '@/components/ActionButton'
import Image from 'next/image'
import { ManipulationContext } from '@/features/ManipulationContext'
import ManipulationOptions from '@/components/ManipulationOptions'

function Manipulations({ files }: { files: string[] }) {
  const { setManipulation } = useContext(ManipulationContext)
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

  return (
    <div className={`flex size-full h-svh`}>
      <div className={`flex size-full max-w-[240px] flex-col gap-[10px] p-[15px]`}>
        <div className={`flex flex-col gap-[4px]`}>
          <div className={`font-roboto_condensed text-header-100`}>Особые:</div>
          <ActionButton
            value={'save'}
            text={'Сохранить'}
            className={`rounded-[6px] bg-base-button-yellow py-[3px] text-base-200 text-base-white`}
          />
        </div>
        <div className={`flex flex-col gap-[4px]`}>
          <div className={`font-roboto_condensed text-header-100`}>Манипулирование</div>
          <ActionButton
            value={'convert'}
            text={'Конвертировать'}
            className={`rounded-[6px] bg-base-button-green py-[3px] text-base-200 text-base-white`}
            action={setManipulation}
          />
        </div>
      </div>

      <div className={`w-full border-l border-r border-l-base-button-green border-r-base-button-green`}>
        <div className={`flex flex-wrap items-center gap-[10px]`}>{showImages()}</div>
      </div>
      <div className={`w-full max-w-[400px] p-[15px]`}>
        <ManipulationOptions />
      </div>
    </div>
  )
}

export default Manipulations
