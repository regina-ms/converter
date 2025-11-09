import { Action, FORMATS, Option } from '@/actionsTypes'
import DEFAULT from '@/defaultConvertOptions'
import { ActionContext } from '@/features/ActionContext'
import { createConvertAction, updateOptions } from '@/features/typesManipulations'
import OptionsSelect from '@/ui/OptionsSelect'
import OptionsTextField from '@/ui/OptionsTextField'
import { Checkbox, FormControlLabel, MenuItem } from '@mui/material'
import { useContext } from 'react'


function useConvertOptions(format?: keyof typeof FORMATS) {
    const {_setActions} = useContext(ActionContext)

    if(!format) {
        return null
    }

    const defaultOptions = DEFAULT[format]

    const onChangeOption = (newOption: Option) => {
        const newOptionsList = updateOptions(defaultOptions, newOption)
        const newAction: Action<'convert'> = createConvertAction(format, [...newOptionsList])
        _setActions(newAction)
    }

    const showOptions = () => {
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
    }

    return <>{showOptions()}</>
}


export default useConvertOptions