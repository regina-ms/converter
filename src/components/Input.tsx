import React from 'react'

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function Input({ onChange }: Props) {
  return (
    <div className={`flex h-svh w-full items-center justify-center`}>
      <div className='relative flex h-[350px] w-full max-w-[600px] items-center justify-center rounded-[18px] border border-base-border'>
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
    </div>
  )
}

export default Input
