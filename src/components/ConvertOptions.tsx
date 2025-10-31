'use client'

import { ConvertActionType, FORMATS_ARRAY, Png } from '@/actionsTypes'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useState } from 'react'

type ConvertOptionsProps = {
  format: (typeof FORMATS_ARRAY)[number]
}

export function ConvertOptions({ format }: ConvertOptionsProps) {
  const defaultOptions: ConvertActionType<Png>['options'] = {
    quality: 80,
    compressionLevel: 0,
  }

  const [options, setOptions] = useState(defaultOptions)

  function showOptions() {
    switch (format) {
      case 'png':
        return (
          <FormControl variant='standard'>
            <InputLabel id='png-opt-compess-level'>Уровень сжатия</InputLabel>
            <Select>
              {Array.from({ length: 9 }, (_, index) => index + 1).map((value) => (
                <MenuItem value={value}>{value}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )
    }
  }
  return <>{showOptions()}</>
}
