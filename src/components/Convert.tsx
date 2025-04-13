'use client'
import React, { Fragment, useContext, useEffect, useState } from 'react'
import ActionButton from '@/ui/ActionButton'
import { ACTIONS } from '@/constants'
import { ActionContext } from '@/features/ActionContext'
import { convertFile } from '@/methods/convertFile'
import { archiveFiles } from '@/methods/archiveFiles'

function Convert() {
  const data = ACTIONS.find((action) => action.type === 'convert')
  const [format, setFormat] = useState<string>(data?.options[0] || '')
  const { input, output } = useContext(ActionContext)

  const onBtnClick = () => {
    input.data.forEach((image) => {
      convertFile(image.name, format).then(output.set).then(archiveFiles)
    })
  }

  return (
    <Fragment>
      <div className={`mb-[10px] text-header-200`}>{data?.name}</div>
      <div className={`flex items-center gap-[6px] text-[13px]`}>
        <div>Формат</div>
        <select
          className={`w-full max-w-[211px] rounded-[4px] border border-[#C9CCD6] px-[9px] py-[6px]`}
          onChange={(e) => setFormat(e.target.value)}
        >
          {data?.options.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <ActionButton
        className={`mt-[12px] rounded-[12px] bg-base-button-brown px-[15px] py-[10.5px]`}
        action={onBtnClick}
      >
        Вперед
      </ActionButton>
    </Fragment>
  )
}

export default Convert
