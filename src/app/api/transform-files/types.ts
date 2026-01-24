import { Action } from '@/actionsTypes'
import { ImageData, LikeBufferObject } from '@/app/api/get-file-data/route'

export type Body = {
    files: ImageData<LikeBufferObject>[],
    actions: Action<'convert' | 'resize'>[]
}