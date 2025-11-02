'use client'
import { FORMATS_ARRAY, GeneralOptions, JpegOptions, PngOptions, WebpOptions } from '@/actionsTypes'
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'

type ConvertOptionsProps = {
  format: (typeof FORMATS_ARRAY)[number]
  options: (PngOptions[number] | WebpOptions[number] | JpegOptions[number] | GeneralOptions[number])[]
}

export function ConvertOptions({ format, options }: ConvertOptionsProps) {
  //console.log(options)
  const selectHandler = (e: SelectChangeEvent) => {
    const target = Number(e.target.value)
    const name = e.target.name
  }

  function showOptions() {
    return options.map((option) => {
      switch (option.id) {
        case 'compressionLevel':
          return (
            <FormControl variant='standard' fullWidth>
              <InputLabel id={option.id}>{option.name}</InputLabel>
              <Select labelId={option.id} value={option.value} label={option.name}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <MenuItem value={index + 1}>{index + 1}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )
      }
    })
  }
  return <Box sx={{ display: 'flex', gap: 8 }}>{showOptions()}</Box>
}
