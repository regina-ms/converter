'use client'
import { createContext, PropsWithChildren, useEffect, useState } from 'react'
import { Action, PUBLIC_PATHS } from '@/constants'
import { getFiles } from '@/methods/getFiles'
import { ImageData } from '@/app/api/get-files/route'

interface ActionContextObject {
  action: Action | undefined
  setAction: (value: Action) => void
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
  const [action, setAction] = useState<Action>()
  const [inputFiles, setInputFiles] = useState<ImageData[]>([])
  const [outputFiles, setOutputFiles] = useState<ImageData[]>([])

  const _setInputFiles = async () => {
    const { data } = await getFiles(PUBLIC_PATHS.input)
    if (!data.length) return
    setInputFiles(data)
  }

  const _setOutPutFiles = async () => {
    const { data } = await getFiles(PUBLIC_PATHS.output)
    if (!data.length) return
    setOutputFiles(data)
  }

  useEffect(() => {
    _setInputFiles()
  }, [])

  return (
    <ActionContext.Provider
      value={{
        action,
        setAction,
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
