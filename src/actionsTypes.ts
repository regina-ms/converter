import { PngOptions as SharpPngOptions, WebpOptions as SharpWebpOptions } from 'sharp'

const FORMATS = {
  png: 'png' as const,
  webp: 'webp' as const,
  jpeg: 'jpeg' as const,
  gif: 'gif' as const,
} as const

const OPTIONS_NAME = {
  quality: 'Качество изображения. Число от 1 до 100' as const,
  compressionLevel: 'Уровень сжатия png' as const,
  alphaQuality: 'Качество прозрачности (альфа-канала). Число от 0 до 100' as const,
  lossless: 'сжать без потерь' as const,
  nearLossless: 'сжать почти без потерь' as const,
} as const

export const FORMATS_ARRAY = Object.values(FORMATS)

type Option<K extends keyof typeof OPTIONS_NAME, V> = {
  id: K
  name: (typeof OPTIONS_NAME)[K]
  value: V
}

export type GeneralOptions = [Option<'quality', number | undefined>]
export type PngOptions = [Option<'compressionLevel', SharpPngOptions['compressionLevel']>]
export type WebpOptions = [
  Option<'alphaQuality', SharpWebpOptions['alphaQuality']>,
  Option<'lossless', SharpWebpOptions['lossless']>,
  Option<'nearLossless', SharpWebpOptions['nearLossless']>,
]
export type JpegOptions = []

export type Png = {
  format: (typeof FORMATS)['png']
  options: PngOptions
}
export type Webp = {
  format: (typeof FORMATS)['webp']
  options: WebpOptions
}
export type Jpeg = {
  format: (typeof FORMATS)['jpeg']
  options: JpegOptions
}

export type ConvertAction = Png | Jpeg | Webp

export type Action = {
  id: string
  data: ResizeAction | ConvertAction
}

export type ResizeAction = {
  width?: number
  height?: number
}
