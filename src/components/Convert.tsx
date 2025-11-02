'use client'

import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useEffect, useState } from 'react'
import { ConvertOptions } from '@/components/ConvertOptions'
import { GeneralOptions, FORMATS_ARRAY, JpegOptions, PngOptions, WebpOptions } from '@/actionsTypes'

function Convert() {
  const defaultOptions: GeneralOptions = [
    {
      id: 'quality',
      name: 'Качество изображения. Число от 1 до 100.',
      value: 80,
    },
  ]

  const defaultPngOptions: PngOptions = [
    {
      id: 'compressionLevel',
      name: 'Уровень сжатия png.',
      value: 80,
    },
  ]

  const defaultWebpOptions: WebpOptions = [
    {
      id: 'alphaQuality',
      name: 'Качество прозрачности (альфа-канала). Число от 0 до 100.',
      value: 100,
    },
    {
      id: 'lossless',
      name: 'сжать без потерь',
      value: false,
    },
    {
      id: 'nearLossless',
      name: 'сжать почти без потерь',
      value: false,
    },
  ]
  const defaultJpegOptions: JpegOptions = []

  const [selectedFormat, setSelectedFormat] = useState<(typeof FORMATS_ARRAY)[number] | ''>('')

  const [options, setOptions] = useState<
    (PngOptions[number] | WebpOptions[number] | JpegOptions[number] | GeneralOptions[number])[]
  >([])

  const selectHandler = (e: SelectChangeEvent) => {
    setSelectedFormat((e.target.value as (typeof FORMATS_ARRAY)[number]) || '')
  }

  useEffect(() => {
    switch (selectedFormat) {
      case 'png':
        setOptions([...defaultOptions, ...defaultPngOptions])
        break
      case 'webp':
        setOptions([...defaultOptions, ...defaultWebpOptions])
        break
      case 'jpeg':
        setOptions([...defaultOptions, ...defaultJpegOptions])
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
          {FORMATS_ARRAY.map((value) => (
            <MenuItem value={value}>{value}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedFormat && <ConvertOptions format={selectedFormat} options={options} />}
    </Box>
  )
}

export default Convert
