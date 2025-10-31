const FORMATS = {
  png: 'png' as const,
  webp: 'webp' as const,
  jpeg: 'jpeg' as const,
  gif: 'gif' as const,
}

export const FORMATS_ARRAY = Object.values(FORMATS)

export type Action = {
  id: string
  data: ConvertAction | ResizeAction
}

export type ConvertAction = ConvertActionType<Png> | ConvertActionType<Webp> | ConvertActionType<Jpeg>

export type ConvertActionType<FormatType extends Png | Webp | Jpeg> = {
  type: FormatType['type']
  options: Options<FormatType['options']>
}

export type Options<FormatTypeOptions> = {
  quality: number // Качество изображения. Число от 1 до 100.
} & FormatTypeOptions

export type Png = {
  type: (typeof FORMATS)['png']
  options: {
    compressionLevel: number // Уровень сжатия. Число от 0 до 9
  }
}

export type Webp = {
  type: (typeof FORMATS)['webp']
  options: {
    alphaQuality: number // Качество прозрачности (альфа-канала). Число от 0 до 100.
    compressionMode: 'lossless' | 'nearLossless' //Уровень сжатия. lossless - без потерь, nearLossless - почти без потерь
  }
}

export type Jpeg = {
  type: (typeof FORMATS)['jpeg']
  options: {}
}

export type ResizeAction = {
  width?: number
  height?: number
}
