import { Action } from '@/actionsTypes'

export type Body = {
    fileNames: string[],
    actions: Action<'convert' | 'resize'>[]
}