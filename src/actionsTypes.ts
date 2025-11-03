export const OPTIONS_NAME = {
  quality: 'Качество изображения. Число от 1 до 100' as const,
  compressionLevel: 'Уровень сжатия png' as const,
  alphaQuality: 'Качество прозрачности (альфа-канала). Число от 0 до 100' as const,
  lossless: 'сжать без потерь' as const,
  nearLossless: 'сжать почти без потерь' as const,
} as const

export const FORMATS = {
  png: 'png' as const,
  webp: 'webp' as const,
  jpeg: 'jpeg' as const,
} as const

export type Option<N extends keyof typeof OPTIONS_NAME = keyof typeof OPTIONS_NAME> = {
  name: N
  description?: typeof OPTIONS_NAME[N],
  value: any
  maxValue?:number
  minValue?:number
}


export type Png = {
  options: [Option<'quality'>, Option<'compressionLevel'>]
}
export type Webp = {
  options: [Option<'quality'>, Option<'alphaQuality'>, Option<'nearLossless'>, Option<'lossless'>]
}
export type Jpeg = {
  options: [Option<'quality'>]
}

export type ResizeAction = {
  width? : number
  height?:number
}

export type OptionTypes<F extends keyof typeof FORMATS = keyof typeof FORMATS> = {
  options:
      F extends 'png'
          ? Png['options']
          : F extends 'webp'
              ? Webp['options']
              : F extends 'jpeg'
                  ? Jpeg['options']
                  : never
}


export type Action<T extends 'convert' | 'resize', F extends keyof typeof FORMATS = keyof typeof FORMATS> = {
  id: T
  data: T extends 'convert' ? {
    format: F,
    options: OptionTypes<F>['options']
  } : ResizeAction

}








