'use client'

import { Box, FormControl, FormLabel, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { ActionContext } from '@/features/ActionContext'
import { IMAGE_TYPES } from '@/constants'

function Convert() {
  const { _setActions } = useContext(ActionContext)

  const [format, setFormat] = useState('')
  const [options, setOptions] = useState<any[]>([])
  const selectHandler = (e: SelectChangeEvent) => {
    setFormat(e.target.value)
  }

  useEffect(() => {
    switch (format) {
      case 'png':
        const opt1 = {
          name: 'Уровень сжатия. Число от 0 до 9',
          value: 'compressionLevel',
        }
    }
  }, [format])

  return (
    <>
      <FormControl sx={{ width: '100%' }}>
        <InputLabel id='demo-select-small-label'>Конвертировать в</InputLabel>
        <Select
          id='demo-select-small'
          labelId='demo-select-small-label'
          label='Конвертировать в'
          value={format}
          onChange={selectHandler}
          fullWidth
        >
          <MenuItem value='' />
          {IMAGE_TYPES.map((type) => {
            return <MenuItem value={type}>{type}</MenuItem>
          })}
        </Select>
      </FormControl>
    </>
  )
}

export default Convert
