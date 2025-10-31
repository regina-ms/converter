'use client'

import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { ActionContext } from '@/features/ActionContext'
import { FORMATS_ARRAY } from '@/actionsTypes'
import { ConvertOptions } from '@/components/ConvertOptions'

function Convert() {
  const { _setActions } = useContext(ActionContext)
  const [options, setOptions] = useState()

  const [selectedFormat, setSelectedFormat] = useState<(typeof FORMATS_ARRAY)[number] | ''>('')

  const selectHandler = (e: SelectChangeEvent) => {
    setSelectedFormat((e.target.value as (typeof FORMATS_ARRAY)[number]) || '')
  }

  useEffect(() => {
    switch (selectedFormat) {
      case 'png':
    }
  }, [selectedFormat])

  return (
    <>
      <FormControl sx={{ width: '100%' }}>
        <InputLabel id='convert-type'>Конвертировать в</InputLabel>
        <Select
          labelId='convert-type'
          label='Конвертировать в'
          value={selectedFormat}
          onChange={selectHandler}
          fullWidth
        >
          <MenuItem value={''}>
            <em>не конвертировать</em>
          </MenuItem>
          {FORMATS_ARRAY.map((value) => (
            <MenuItem value={value}>{value}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedFormat && <ConvertOptions format={selectedFormat} />}
    </>
  )
}

export default Convert
