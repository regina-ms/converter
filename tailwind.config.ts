import type { Config } from 'tailwindcss'

export function adaptiveFz(value: number, min = 1, max = 20, mod = 10) {
  return `clamp(${min}rem, calc(${value} * ${mod} * var(--screen-delta) + ${value}rem), ${max}rem)`
}

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      ubuntu_condensed: ['var(--font-ubuntu_condensed)'],
      roboto_condensed: ['var(--font-roboto_condensed)'],
      inter: ['var(--font-inter)'],
    },
    fontSize: {
      'base-100': [
        adaptiveFz(2.2),
        {
          lineHeight: '25px',
        },
      ],
      'base-200': [
        adaptiveFz(1.2),
        {
          lineHeight: '13px',
        },
      ],
      'header-100': [
        adaptiveFz(1.4),
        {
          lineHeight: '16px',
        },
      ],
      'header-200': [
        adaptiveFz(1.8),
        {
          lineHeight: '21px',
        },
      ],
      default: [
        adaptiveFz(1.3),
        {
          lineHeight: '16px',
        },
      ],
    },
    colors: {
      base: {
        black: 'hsl(0,0%,0%)',
        white: 'hsl(0,0%,100%)',
        button: {
          green: 'hsl(180,34%,25%)',
          yellow: 'hsl(37,53%,36%)',
          brown: 'hsl(14,52%,24%)',
        },
        border: 'hsl(113,36%,46%)',
      },
    },
  },
  plugins: [],
} satisfies Config
