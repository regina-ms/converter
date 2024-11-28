import React from 'react'

interface ActionButton {
  value: string
  text: string
  action: (value: string) => void
  className?: string
}

interface Props {
  list: ActionButton[]
}
function ActionButtons({ list }: Props) {
  return (
    <ul className={`flex flex-col gap-[5px] text-base-200 text-base-white`}>
      {list.map((button) => (
        <li key={button.text}>
          <button
            className={`w-full rounded-[6px] py-[3px] text-base-200 text-base-white ${button.className}`}
            value={button.value}
            onClick={(e) => button.action(e.currentTarget.value)}
          >
            {button.text}
          </button>
        </li>
      ))}
    </ul>
  )
}

export default ActionButtons
