import React, { PropsWithChildren } from 'react'

interface Props extends PropsWithChildren {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  containerClassName?: string
}

function InputFile({ onChange, containerClassName, children }: Props) {
  const _containerClassName =
    containerClassName ||
    'relative flex h-[350px] w-full max-w-[600px] items-center justify-center rounded-[18px] border border-base-border'
  return (
    <div className={`relative ${_containerClassName}`}>
      <input
        type='file'
        accept={'image/*'}
        multiple
        className='absolute inset-0 size-full cursor-pointer opacity-0'
        onChange={onChange}
      />
      {children}
    </div>
  )
}

export default InputFile
