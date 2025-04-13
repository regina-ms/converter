import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { ImageData } from '@/app/api/get-files/route'
import Link from 'next/link'

function InputFiles({ files }: { files: ImageData[] }) {
  function showImages() {
    return files.map((image, index) => (
      <li key={index} className={`flex flex-col gap-[5px]`}>
        <Link href={image.name} target={'_blank'} download>
          <Image
            src={image.name}
            alt={''}
            width={image.width}
            height={image.height}
            className={`w-full max-w-[200px] object-contain object-left`}
          />
        </Link>
        <div>{`Формат: ${image.format}`}</div>
        <div>{`Размер: ${image.size}`}</div>
        <div>{`Ширина: ${image.width}`}</div>
        <div>{`Высота: ${image.height}`}</div>
      </li>
    ))
  }
  return <ul className={`flex flex-wrap items-end gap-[10px]`}>{showImages()}</ul>
}

export default InputFiles
