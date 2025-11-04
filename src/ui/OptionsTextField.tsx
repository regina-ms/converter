import { Option, OPTIONS_NAME } from '@/actionsTypes'
import { StandardTextFieldProps, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'

interface CustomTextFieldProps extends StandardTextFieldProps {
    customOnChange?: (option: Option) => void
    minValue?: number
    maxValue?: number
    name: keyof typeof OPTIONS_NAME
    id: string
}

type ErrorData =  {
    error: true
    errorText: string
} | {
    error: false
    errorText?: never
}

function OptionsTextField({id, name, label, value, customOnChange, minValue, maxValue}:CustomTextFieldProps) {
    const [localValue, setLocalValue] = useState<number>(value as number)
    const [errorData, setErrorData] = useState<ErrorData>({error:false})


    const localOnchange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value ? parseInt(e.target.value) : 0
        setLocalValue(value)
    }

    useEffect(() => {
        if(maxValue && localValue > maxValue){
            setErrorData({error:true, errorText: `Значение не может превышать ${maxValue}`})
        } else if (minValue && localValue < minValue) {
            setErrorData({error: true, errorText: `Значение не может быть ниже ${minValue}`})
        } else {
            setErrorData({error:false})
            customOnChange && customOnChange({id, name, value: localValue})
        }
    }, [localValue])

    return (<TextField name={name} label={label} variant='standard' value={localValue} onChange={localOnchange} helperText={errorData.errorText} error={errorData.error}/>)
}

export default OptionsTextField