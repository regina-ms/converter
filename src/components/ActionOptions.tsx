'use client'

import { useContext } from 'react'
import { ActionContext } from '@/features/ActionContext'
import Convert from '@/components/Convert'

export function ActionOptions() {
  const { action } = useContext(ActionContext)

  function showOptions() {
    if (!action?.id) return null

    switch (action.type) {
      case 'convert':
        return <Convert />
      case 'resize':
        return <div>изменить размер</div>
    }
  }

  return <div className={`w-full max-w-[400px] border-l border-l-base-border p-[15px]`}>{showOptions()}</div>
}
