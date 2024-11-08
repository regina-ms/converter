'use client'

import React, { useEffect, useState } from 'react'

export default function Page() {
  const [files, setFiles] = useState<File[]>([])
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setFiles([...e.target.files])
  }

  useEffect(() => {
    const data = new FormData()
    files.forEach((file, index) => data.append(`file-${index}`, file))

    fetch('/api/write-files', {
      method: 'POST',
      body: data,
    })
  }, [files])

  return (
    <div className='relative m-auto flex h-[350px] w-full max-w-[600px] items-center justify-center rounded-[18px] border border-base-border'>
      <input
        type='file'
        accept={'image/*'}
        multiple
        className='absolute inset-0 size-full cursor-pointer opacity-0'
        onChange={onChange}
      />
      <div className='w-full max-w-[290px] text-center text-base-100'>
        Нажмите или перенесите, чтобы добавить фотографии
      </div>
    </div>
  )
}
