import { Option } from '@/actionsTypes'
import { StandardTextFieldProps, TextField } from '@mui/material'
import React from 'react'

interface CustomTextFieldProps extends StandardTextFieldProps {
    customOnChange?: (option: Option) => void
}

function OptionsTextField({name, label, value, customOnChange}:CustomTextFieldProps) {


    return (<TextField name={name} label={label} variant='standard' value={value || ''}/>)
}

export default OptionsTextField