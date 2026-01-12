import { Avif, Jpeg, Png, Webp } from '@/actionsTypes'

const PNG: Png['options'] = [
    {
        id: 'CzLCo0M06jbCz0z4yHcu3',
        name: 'quality',
        description: 'Качество изображения. Число от 1 до 100',
        value: 80,
        maxValue:100,
        minValue: 0
    },
    {
        id: 'oUEFF32-dRs6TVSuVDPVG',
        name: 'compressionLevel',
        description: 'Уровень сжатия png',
        value: 6
    }
]

const WEBP: Webp['options'] = [
    {
        id: 'qWjTmuD-0RDco4BI7s-eg',
        name: 'quality',
        description: 'Качество изображения. Число от 1 до 100',
        value: 80,
    },
    {
        id: 'dyymPpf1Iaf6rXmAdkd0i',
        name: 'alphaQuality',
        description: 'Качество прозрачности (альфа-канала). Число от 0 до 100',
        value: 100,
        maxValue:100,
        minValue: 0
    },
    {
        id: 'HiAgDY1wwlff-5c93nwNv',
        name: 'lossless',
        description: 'сжать без потерь',
        value: false,
    },
]

const JPEG:Jpeg['options'] = [{
    id: 'OonZfzSRMTB-BHUTB2bE9',
    name: 'quality',
    description: 'Качество изображения. Число от 1 до 100',
    value: 80,
},]

const AVIF:Avif['options'] = [{
    id: 'OonZfzSRMTB-BHUTB2bE9',
    name: 'quality',
    description: 'Качество изображения. Число от 1 до 100',
    value: 80,
},]

const DEFAULT = {
    png: PNG,
    webp: WEBP,
    jpeg: JPEG,
    avif: AVIF
}

export default DEFAULT