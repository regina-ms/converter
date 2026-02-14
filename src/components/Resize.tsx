import { Action } from '@/actionsTypes'
import { ActionContext } from '@/features/ActionContext'
import { FilledTextFieldProps, Stack, TextField } from '@mui/material'

import React, { useContext, useRef, useState } from 'react'

interface SizeFieldProps extends FilledTextFieldProps {
  name: 'width' | 'height'
}

function SizeField({ name, label }: SizeFieldProps) {
  const { actions, setUniqueActions } = useContext(ActionContext)
  const [value, setValue] = useState<number>()
  const timeout = useRef<NodeJS.Timeout>()

  function getResizeOptions() {
    return actions.find((action) => action.id === 'resize')?.data as Action<'resize'>['data']
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (timeout.current) clearTimeout(timeout.current)
    const currentValue = e.target.value ? parseInt(e.target.value) : undefined
    setValue(currentValue)
    const options = getResizeOptions()

    timeout.current = setTimeout(() => {
      const newAction: Action<'resize'> = {
        id: 'resize',
        data: { ...options, [name]: currentValue },
      }

      setUniqueActions(newAction)
    }, 500)
  }

  return <TextField name={name} label={label} variant='filled' onChange={onChange} value={value || ''} />
}

function Resize() {
  return (
    <Stack direction='row' gap={4}>
      <SizeField variant='filled' name='width' label='Ширина в px' />
      <SizeField variant='filled' name='height' label='Длина в px' />
    </Stack>
  )
}

export default Resize
