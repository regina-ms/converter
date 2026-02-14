'use client'
import { SavedImage } from '@/methods/uploadFiles'
import { createContext, PropsWithChildren, useState } from 'react'
import { Action, ACTION_TYPES } from '@/actionsTypes'

interface ActionContextObject {
  actions: Action<'convert' | 'resize'>[]
  setUniqueActions: (action: Action<'convert' | 'resize'>) => void
  deleteAction: (id: keyof typeof ACTION_TYPES) => void
  rawImages: SavedImage[]
  setRawImages: (images: SavedImage[]) => void
  deleteImage: (dataUrl: string) => void
}

export const ActionContext = createContext({} as ActionContextObject)

export function ActionContextProvider({ children }: PropsWithChildren) {
  const [actions, setActions] = useState<Action<'convert' | 'resize'>[]>([])
  const [rawImages, setRawImages] = useState<SavedImage[]>([])

  const deleteImage = (url: string) => {
    const updatedFiles = rawImages.filter((file) => file.url !== url)
    setRawImages(updatedFiles)
  }

  const setUniqueActions = (newAction: Action<'convert' | 'resize'>) => {
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
        setUniqueActions,
        deleteAction,
        rawImages,
        setRawImages,
        deleteImage,
      }}
    >
      {children}
    </ActionContext.Provider>
  )
}
