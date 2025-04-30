export type ConvertOptions = string[]
export type ResizeOptions = { width: number; height: number }

type GeneralActionProperties = {
  id: string
  name: string
}

type SelfProperties =
  | {
      type: 'convert'
      options: ConvertOptions
    }
  | {
      type: 'resize'
      options: ResizeOptions
    }

export type Action = GeneralActionProperties & SelfProperties

export const ACTIONS: Action[] = [
  {
    id: 'xd080sD8mIQDAUfDMdE02',
    type: 'convert',
    name: 'Конвертировать',
    options: ['webp', 'png', 'jpg'],
  },
  {
    id: '1y1jQT9ANW7hL6BGOVUy_',
    type: 'resize',
    name: 'Изменить размер',
    options: {
      width: 0,
      height: 0,
    },
  },
]

export const PATHS = {
  input: 'input',
  output: 'output',
}

export const PUBLIC_PATHS = {
  input: 'public/input',
  output: 'public/output',
}

export const RESULT_PATH = '/public/result.zip'
