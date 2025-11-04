'use client'

import { Png, Jpeg, Webp, FORMATS, OptionTypes } from '@/actionsTypes'
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useEffect, useState } from 'react'
import { ConvertOptions } from '@/components/ConvertOptions'

function Convert() {

  const defaultPngOptions: Png['options'] = [
    {
      id: 'CzLCo0M06jbCz0z4yHcu3',
      name: 'quality',
      description: 'Качество изображения. Число от 1 до 100',
      value: 80,
      maxValue:100,
      minValue: 0
    },
    {
      id: 'oUEFF32-dRs6TVSuVDPVG',
      name: 'compressionLevel',
      description: 'Уровень сжатия png',
      value: 6
    }
  ]

  const defaultWebpOptions: Webp['options'] = [
    {
      id: 'qWjTmuD-0RDco4BI7s-eg',
      name: 'quality',
      description: 'Качество изображения. Число от 1 до 100',
      value: 80,
    },
    {
      id: 'dyymPpf1Iaf6rXmAdkd0i',
      name: 'alphaQuality',
      description: 'Качество прозрачности (альфа-канала). Число от 0 до 100',
      value: 100,
      maxValue:100,
      minValue: 0
    },
    {
      id: 'HiAgDY1wwlff-5c93nwNv',
      name: 'lossless',
      description: 'сжать без потерь',
      value: false,
    },
  ]

  const defaultJpegOptions:Jpeg['options'] = [{
    id: 'OonZfzSRMTB-BHUTB2bE9',
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
        return setDefaultOptions([...defaultPngOptions] )

      case 'webp':
        return setDefaultOptions([...defaultWebpOptions] )

      case 'jpeg':
        return setDefaultOptions([...defaultJpegOptions ])

      default:
        return setDefaultOptions([])
    }
  }, [selectedFormat])


  function showConvertOptions() {
    if(defaultOptions.length && selectedFormat) {
      return <ConvertOptions format={selectedFormat} defaultOptions={defaultOptions} />
    }

    return null
  }

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
      {showConvertOptions()}
    </Box>
  )
}

export default Convert
