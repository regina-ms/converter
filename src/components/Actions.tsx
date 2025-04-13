'use client'
import React, { useContext, useState } from 'react'
import { Action, ACTIONS, RESULT_PATH } from '@/constants'
import { ActionContext } from '@/features/ActionContext'
import ActionButton from '@/ui/ActionButton'
import { archiveFiles } from '@/methods/archiveFiles'
import Link from 'next/link'

function Actions() {
  const { output, setAction } = useContext(ActionContext)

  const onButtonCLick = (buttonAction: Action) => setAction(buttonAction)

  function showActionButtons() {
    return ACTIONS.map((action) => {
      return (
        <li key={action.id}>
          <ActionButton
            className={`flex w-full items-center justify-center rounded-[6px] bg-base-button-green py-[3px] font-ubuntu_condensed text-base-200 text-base-white`}
            action={() => onButtonCLick(action)}
          >
            {action.name}
          </ActionButton>
        </li>
      )
    })
  }
  return (
    <div className={`flex size-full max-w-[240px] flex-col gap-[10px] p-[15px]`}>
      <div className={`font-roboto_condensed text-header-100`}>Манипулирование</div>
      <ul className={`flex flex-col gap-[5px]`}>{showActionButtons()}</ul>
      {output.data.length ? (
        <Link href={RESULT_PATH} target={'_blank'} download={true} className={`bg-base-button-brown`}>
          Сохранить
        </Link>
      ) : null}
    </div>
  )
}

export default Actions
