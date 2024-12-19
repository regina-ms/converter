import React from 'react'

interface ActionButton {
  value: string
  text: string
  action?: (value: string) => void
  className: string
}

function ActionButton({ ...button }: ActionButton) {
  return (
    <button className={button.className} value={button.value} onClick={(e) => button.action?.(e.currentTarget.value)}>
      {button.text}
    </button>
  )
}

export default ActionButton
