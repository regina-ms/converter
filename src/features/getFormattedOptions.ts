import { Action, OPTIONS_NAME } from '@/actionsTypes'

export function getFormattedOptions(rawOptions: Action<'convert'>['data']['options']) {

    const formattedOptions: Partial<Record<keyof typeof OPTIONS_NAME, any>> = {}

    rawOptions.forEach((option) => {
        formattedOptions[option.name] = option.value
    })

    return formattedOptions

}