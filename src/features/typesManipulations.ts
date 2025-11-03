import { Action, FORMATS, Option, OPTIONS_NAME, OptionTypes } from '@/actionsTypes'

export function createConvertAction<F extends keyof typeof FORMATS>(format: F, options: OptionTypes<F>['options']):Action<'convert', F> {

    return {
        id: 'convert',
        data: {
            format,
            options
        }
    }
}

export function updateOptions<F extends keyof typeof FORMATS, N extends keyof typeof OPTIONS_NAME>(options: OptionTypes<F>['options'], newOption: Option<N>):OptionTypes<F>['options'] {

    return options.map((option) => {
        if(option.name === newOption.name) option.value = newOption.value
        return option
    }) as OptionTypes<F>['options']

}