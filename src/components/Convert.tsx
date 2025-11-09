'use client'

import { FORMATS } from '@/actionsTypes'
import { ActionContext } from '@/features/ActionContext'
import useConvertOptions from '@/useConvertOptions'
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useContext, useState } from 'react'

function Convert() {

  const {deleteAction} = useContext(ActionContext)

  const [selectedFormat, setSelectedFormat] = useState<keyof typeof FORMATS | undefined>(undefined)

  const Options = useConvertOptions(selectedFormat)

  const selectHandler = (e: SelectChangeEvent<keyof typeof FORMATS | ''>) => {
    const target = e.target.value

    if(target === '') {
      setSelectedFormat(undefined)
      deleteAction('convert')
      return
    }
    setSelectedFormat(target)
  }

  return (
    <Box maxWidth='600px' width='100%'>
      <FormControl fullWidth>
        <InputLabel id='convert-type'>Конвертировать в</InputLabel>
        <Select
          labelId='convert-type'
          label='Конвертировать в'
          value={selectedFormat || ''}
          onChange={selectHandler}
          fullWidth
        >
          <MenuItem value={''}>
            <em>не конвертировать</em>
          </MenuItem>
          {Object.values(FORMATS).map((value) => (
            <MenuItem value={value}>{value}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {Options}
    </Box>
  )
}

export default Convert
