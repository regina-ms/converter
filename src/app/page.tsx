import React from 'react'
import { cookies } from 'next/headers'
import Actions from '@/components/Actions'
import { ActionContextProvider } from '@/features/ActionContext'
import FileList from '@/components/FileList/FileList'
import { HiddenFileInput } from '@/components/HiddenFileInput'
import { userDir } from '@/methods/userDir'
import { existsSync } from 'node:fs'
import { SavedImage } from '@/methods/uploadFiles'
import { getRawUserImages } from '@/methods/getRawUserImages'
import { COOKIE_ID } from '@/constants'

export default async function Page() {
  let existingUserImages: SavedImage[] = []

  const cookieStore = await cookies()
  const userId = cookieStore.get(COOKIE_ID)?.value
  const userFolder = userId && existsSync(userDir(userId))

  /* TODO: удалить архив из папки пользователя после скачивания, тк в existingUserImages попадает архив и sharp падает либо поправить фильтрацию в getUserImages  */
  if (userFolder) {
    existingUserImages = await getRawUserImages(userId)
  }
  return (
    <ActionContextProvider existingUserImagesList={existingUserImages}>
      <HiddenFileInput />
      <Actions />
      <FileList />
    </ActionContextProvider>
  )
}
