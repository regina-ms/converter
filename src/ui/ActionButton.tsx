'use client'
import React, { MouseEventHandler, PropsWithChildren, ReactNode } from 'react'
import Link from 'next/link'

interface ActionButton extends PropsWithChildren {
  action?: () => void
  className?: string
  children: ReactNode
}

function ActionButton({ ...button }: ActionButton) {
  return (
    <button className={`text-center text-base-white ${button.className}`} onClick={button.action}>
      {button.children}
    </button>
  )
}

export default ActionButton
