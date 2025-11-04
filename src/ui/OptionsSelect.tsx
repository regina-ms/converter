import { Option, OPTIONS_NAME } from '@/actionsTypes'
import {
    BaseSelectProps,
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent,
} from '@mui/material'
import React, { useState } from 'react'

interface CustomSelectProps extends BaseSelectProps<string> {
    name: keyof typeof OPTIONS_NAME
    customOnChange?: (option: Option) => void
    id: string
}



function OptionsSelect({name, value,label, children, customOnChange, id}: CustomSelectProps) {
    const [localValue, setLocalValue] = useState<string>(value || '')

    const localOnChange = (e: SelectChangeEvent) => {
        setLocalValue(e.target.value)
        customOnChange && customOnChange({id, name, value:e.target.value})
    }
    return (<FormControl variant='standard' fullWidth key={name}>
        <InputLabel id={name}>{label}</InputLabel>
        <Select labelId={name} value={localValue} label={label} onChange={localOnChange}>
            {children}
        </Select>
    </FormControl>)
}

export default OptionsSelect

