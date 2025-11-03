'use client'
import {
  Action, FORMATS, Option, OptionTypes,
} from '@/actionsTypes'
import { ActionContext } from '@/features/ActionContext'
import { createConvertAction, updateOptions } from '@/features/typesManipulations'
import OptionsSelect from '@/ui/OptionsSelect'
import OptionsTextField from '@/ui/OptionsTextField'
import {
  Box,
  MenuItem,
  Radio,
  TextField, Typography,
} from '@mui/material'
import { useContext } from 'react'

type ConvertOptionsProps = {
  format: keyof typeof FORMATS
  defaultOptions: OptionTypes['options']
}

export function ConvertOptions({ format, defaultOptions }: ConvertOptionsProps) {

  const {_setActions} = useContext(ActionContext)

  const onChangeOption = (newOption: Option) => {
    const newOptionsList = updateOptions(defaultOptions, newOption)
    const a: Action<'convert'> = createConvertAction(format, [...newOptionsList])
    console.log(a)
    _setActions(a)
  }



  function showOptions() {
    return defaultOptions.map((option) => {
      switch (option.name) {
        case 'compressionLevel':
          return (
              <OptionsSelect name={option.name} labelId={option.name} value={option.value?.toString()} label={option.description} key={option.name} customOnChange={onChangeOption}>
                {Array.from({ length: 6 }).map((_, index) => (
                    <MenuItem value={index + 1}>{index + 1}</MenuItem>
                ))}
              </OptionsSelect>
          )
        case 'quality':
          return <OptionsTextField name={option.name} label={option.description} variant='standard' value={option.value || ''} key={option.name}/>
        case 'alphaQuality':
          return <TextField id={option.name} label={option.description} variant='standard' defaultValue={option.value} key={option.name}/>
        case 'lossless':
          return <Box key={option.name} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Typography variant='body2'>{option.description}</Typography>
            <Radio checked={option.value} value={option.name} name="compress-mode" />
          </Box>
        case 'nearLossless':
          return <Box key={option.name}  sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Typography variant='body2'>{option.description}</Typography>
            <Radio checked={option.value} value={option.name} name="compress-mode" />
          </Box>
      }
    })
  }

  return <Box sx={{ display: 'flex', gap: 8, marginY: 6, alignItems:'center'}}>{showOptions()}</Box>
}
