'use client'

import { Png, Jpeg, Webp, FORMATS, OptionTypes } from '@/actionsTypes'
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useEffect, useState } from 'react'
import { ConvertOptions } from '@/components/ConvertOptions'

function Convert() {


  const defaultPngOptions: Png['options'] = [
    {
      name: 'quality',
      description: 'Качество изображения. Число от 1 до 100',
      value: 80,
      maxValue:100,
      minValue: 0
    },
    {
      name: 'compressionLevel',
      description: 'Уровень сжатия png',
      value: 6
    }
  ]

  const defaultWebpOptions: Webp['options'] = [
    {
      name: 'quality',
      description: 'Качество изображения. Число от 1 до 100',
      value: 80,
    },
    {
      name: 'alphaQuality',
      description: 'Качество прозрачности (альфа-канала). Число от 0 до 100',
      value: 100,
      maxValue:100,
      minValue: 0
    },
    {
      name: 'nearLossless',
      description: 'сжать почти без потерь',
      value: false,
    },
    {
      name: 'lossless',
      description: 'сжать без потерь',
      value: false,
    },
  ]

  const defaultJpegOptions:Jpeg['options'] = [{
    name: 'quality',
    description: 'Качество изображения. Число от 1 до 100',
    value: 80,
  },]


  const [selectedFormat, setSelectedFormat] = useState<keyof typeof FORMATS | ''>('')

  const [defaultOptions, setDefaultOptions] = useState<OptionTypes['options'] | []>([])

  const selectHandler = (e: SelectChangeEvent<keyof typeof FORMATS>) => {
    const target = e.target.value
    setSelectedFormat(target)
  }

  useEffect(() => {
    switch (selectedFormat) {
      case 'png':
        setDefaultOptions([...defaultPngOptions] )
        break
      case 'webp':
        setDefaultOptions([...defaultWebpOptions] )
        break
      case 'jpeg':
        setDefaultOptions({...defaultJpegOptions })
            break
      default:
        setDefaultOptions([])
    }
  }, [selectedFormat])

  return (
    <Box sx={{ width: '100%' }}>
      <FormControl fullWidth>
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
          {Object.values(FORMATS).map((value) => (
            <MenuItem value={value}>{value}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {defaultOptions.length && selectedFormat && <ConvertOptions format={selectedFormat} defaultOptions={defaultOptions} />}
    </Box>
  )
}

export default Convert
