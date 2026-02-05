'use client'
import { createContext, PropsWithChildren, useState } from 'react'
import { Action, ACTION_TYPES } from '@/actionsTypes'
import { ImageData } from '@/app/api/get-file-data/route'

interface ActionContextObject {
  actions: Action<'convert' | 'resize'>[]
  _setActions: (action: Action<'convert' | 'resize'>) => void
  deleteAction: (id: keyof typeof ACTION_TYPES) => void
  inputFiles: any[]
  setInputFiles: (files: ImageData[]) => void
  removeInputFile: (dataUrl: string) => void
}

export const ActionContext = createContext({} as ActionContextObject)

export function ActionContextProvider({ children }: PropsWithChildren) {
  const [actions, setActions] = useState<Action<'convert' | 'resize'>[]>([])
  const [inputFiles, setInputFiles] = useState<any[]>([])

  const _setInputFiles = (files: ImageData[]) => {
    const map = new Map<string, ImageData>()
    files.concat(inputFiles).forEach((file) => map.set(file.dataUrl, file))
    setInputFiles(Array.from(map.values()))
  }

  const removeInputFile = (dataUrl: string) => {
    const updatedFiles = inputFiles.filter((file) => file.dataUrl !== dataUrl)
    setInputFiles(updatedFiles)
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
        inputFiles,
        setInputFiles: _setInputFiles,
        removeInputFile,
      }}
    >
      {children}
    </ActionContext.Provider>
  )
}
