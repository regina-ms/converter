import { Action } from '@/actionsTypes'
import { ActionContext } from '@/features/ActionContext'
import {
    Box,
    Checkbox,
    FilledTextFieldProps,
    FormControlLabel,
    Stack,
    TextField,
} from '@mui/material'

import React, { useContext, useRef, useState } from 'react'

interface SizeFieldProps extends FilledTextFieldProps {
    name: 'width' | 'height'
}



function SizeField({name, label}: SizeFieldProps) {

    const {actions, _setActions} = useContext(ActionContext)

    const [value, setValue] = useState<number | ''>('')

    const timeout = useRef<NodeJS.Timeout>()

    function prepared(rawValue: number | '') {
        const value = rawValue === '' ? undefined : rawValue
        const data = actions.find((action) => action.id === 'resize')?.data as Action<'resize'>['data']

        return { value, data}
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(timeout.current) clearTimeout(timeout.current)
        const currentValue = e.target.value ? parseInt(e.target.value) : ''
        setValue(currentValue)
        const {value, data} = prepared(currentValue)

        timeout.current = setTimeout(() => {
            const newAction:Action<'resize'> = {
                id: 'resize',
                data: {...data, [name]: value}
            }

            _setActions(newAction)

        }, 1000)
    }

    return <TextField name={name} label={label} variant="filled" onChange={onChange} value={value}/>
}



function Resize() {

    const [showOptions, setShowOptions] = useState<boolean>(false)


    return (
        <Box>
            <FormControlLabel control={<Checkbox onChange={(e) => setShowOptions(e.target.checked)}/>} label={'Изменить размер'} />
            {showOptions &&
              <Stack direction='row' marginY={2} gap={1}>
                <SizeField variant={'filled'} name='width' label='Ширина в px'/>
                <SizeField variant={'filled'} name='height' label='Длина в px'/>
              </Stack>}
        </Box>
    )
}



export default Resize