'use client'
import { createContext, PropsWithChildren, useEffect, useState } from 'react'
import { getFiles } from '@/methods/getFiles'
import { ImageData } from '@/app/api/get-files/route'
import { PUBLIC_PATHS } from '@/constants'
import { Action, ACTION_TYPES, OPTIONS_NAME } from '@/actionsTypes'

interface ActionContextObject {
  actions: Action<'convert' | 'resize'>[]
  _setActions: (action: Action<'convert' | 'resize'>) => void
  deleteAction: (id: keyof typeof ACTION_TYPES) => void
  input: {
    data: ImageData[]
    set: () => void
  }
  output: {
    data: ImageData[]
    set: () => void
  }
}

export const ActionContext = createContext({} as ActionContextObject)

export function ActionContextProvider({ children }: PropsWithChildren) {
  const [actions, setActions] = useState<Action<'convert' | 'resize'>[]>([])
  const [inputFiles, setInputFiles] = useState<ImageData[]>([])
  const [outputFiles, setOutputFiles] = useState<ImageData[]>([])

  const _setInputFiles = async () => {
    const { data } = await getFiles(PUBLIC_PATHS.input)
    setInputFiles(data)
  }

  const _setOutPutFiles = async () => {
    const { data } = await getFiles(PUBLIC_PATHS.output)
    if (!data.length) return
    setOutputFiles(data)
  }

  const _setActions = (newAction: Action<'convert' | 'resize'>) => {
    const existing = actions.find((existingAction) => existingAction.id === newAction.id)
    let updatedActions: Action<'convert' | 'resize'>[] = actions

    if (existing) {
      updatedActions = actions.filter((act) => act.id !== existing.id)
    }

    setActions(updatedActions.concat(newAction))
  }

  const deleteAction = (id: keyof typeof ACTION_TYPES) => {
    const updatedActions = actions.filter((action) => action.id !== id)
    setActions(updatedActions)
  }

  return (
    <ActionContext.Provider
      value={{
        actions,
        _setActions,
        deleteAction,
        input: {
          data: inputFiles,
          set: _setInputFiles,
        },
        output: {
          data: outputFiles,
          set: _setOutPutFiles,
        },
      }}
    >
      {children}
    </ActionContext.Provider>
  )
}
