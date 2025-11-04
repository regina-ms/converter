'use client'
import {
  Action, FORMATS, Option, OptionTypes,
} from '@/actionsTypes'
import { ActionContext } from '@/features/ActionContext'
import { createConvertAction, updateOptions } from '@/features/typesManipulations'
import OptionsSelect from '@/ui/OptionsSelect'
import OptionsTextField from '@/ui/OptionsTextField'
import {
  Box, Checkbox, FormControlLabel, MenuItem,
} from '@mui/material'
import { useCallback, useContext } from 'react'

type ConvertOptionsProps = {
  format: keyof typeof FORMATS
  defaultOptions: OptionTypes['options']
}

export function ConvertOptions({ format, defaultOptions }: ConvertOptionsProps) {
  const {_setActions} = useContext(ActionContext)

  const onChangeOption = (newOption: Option) => {
    const newOptionsList = updateOptions(defaultOptions, newOption)
    const a: Action<'convert'> = createConvertAction(format, [...newOptionsList])
    _setActions(a)
  }

  const showOptions = useCallback(() => {
    return defaultOptions.map((option) => {
      switch (option.name) {
        case 'compressionLevel':
          return (
              <OptionsSelect name={option.name} labelId={option.name} value={option.value?.toString()} label={option.description} id={option.id} key={option.id} customOnChange={onChangeOption}>
                {Array.from({ length: 6 }).map((_, index) => (
                    <MenuItem value={index + 1}>{index + 1}</MenuItem>
                ))}
              </OptionsSelect>
          )

        case 'quality':
        case 'alphaQuality':
          return <OptionsTextField name={option.name} label={option.description} variant='standard' value={option.value || ''} id={option.id} key={option.id} customOnChange={onChangeOption} maxValue={option.maxValue} minValue={option.minValue}/>

        case 'lossless':
          return <FormControlLabel key={option.id} control={<Checkbox onChange={(e) => {
            const checked = e.target.checked
            onChangeOption({id: option.id, name: option.name, value: checked})
          }}/>} label={option.description} />
      }
    })
  }, [defaultOptions])

  return <Box sx={{ display: 'flex', gap: 8, marginY: 6, alignItems:'center'}}>{showOptions()}</Box>
}
