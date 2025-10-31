'use client'
import { createContext, PropsWithChildren, useEffect, useState } from 'react'
import { getFiles } from '@/methods/getFiles'
import { ImageData } from '@/app/api/get-files/route'
import { PUBLIC_PATHS } from '@/constants'
import { Action } from '@/actionsTypes'

interface ActionContextObject {
  actions: Action[]
  _setActions: (action: Action) => void
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
  const [actions, setActions] = useState<Action[]>([])
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

  const _setActions = (newAction: Action) => {
    const existing = actions.find((existingAction) => existingAction.id === newAction.id)
    let updatedActions: Action[] = []

    if (existing) {
      updatedActions = actions.filter((act) => act.id !== existing.id)
    }

    setActions(updatedActions.concat(newAction))
  }

  useEffect(() => {
    _setInputFiles()
  }, [])

  return (
    <ActionContext.Provider
      value={{
        actions,
        _setActions,
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
