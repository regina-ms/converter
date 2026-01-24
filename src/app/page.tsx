import React from 'react'
import Actions from '@/components/Actions'
import { ActionContextProvider } from '@/features/ActionContext'
import FileList from '@/components/FileList/FileList'
import { HiddenFileInput } from '@/components/HiddenFileInput'

export default function Page() {

  return (
    <ActionContextProvider>
        <HiddenFileInput />
        <Actions />
        <FileList />
    </ActionContextProvider>
  )
}
