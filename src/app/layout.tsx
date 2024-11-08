import '@/styles/globals.css'
import { Ubuntu_Condensed } from 'next/font/google'

const ubuntuCondensed = Ubuntu_Condensed({
  display: 'swap',
  variable: '--font-ubuntu_condensed',
  subsets: ['cyrillic'],
  weight: '400',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ru'>
      <body className={`${ubuntuCondensed.variable} font-ubuntu_condensed`}>{children}</body>
    </html>
  )
}
