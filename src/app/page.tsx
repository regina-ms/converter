import React from 'react'
import { cookies } from 'next/headers'
import Actions from '@/components/Actions'
import { ActionContextProvider } from '@/features/ActionContext'
import FileList from '@/components/FileList/FileList'
import { HiddenFileInput } from '@/components/HiddenFileInput'
import { userDir } from '@/methods/userDir'
import { existsSync } from 'node:fs'
import { SavedImage } from '@/methods/uploadFiles'
import { getUserImages } from '@/methods/getUserImages'

export default async function Page() {
  let existingUserImages: SavedImage[] = []
  const cookieStore = await cookies()
  const userId = cookieStore.get('guest-id')?.value
  /* TODO: удалить архив из папки пользователя после скачивания, тк в existingUserImages попадает архив и sharp падает либо поправить фильтрацию в getUserImages  */
  if (userId && existsSync(userDir(userId))) existingUserImages = await getUserImages(userId)
  return (
    <ActionContextProvider existingUserImagesList={existingUserImages}>
      <HiddenFileInput />
      <Actions />
      <FileList />
    </ActionContextProvider>
  )
}
