import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { Ubuntu_Condensed, Roboto_Condensed, Inter, Roboto } from 'next/font/google'
import { ThemeProvider } from '@mui/material/styles'
import theme from '../theme'
import { Container, CssBaseline } from '@mui/material'

const ubuntuCondensed = Ubuntu_Condensed({
  display: 'swap',
  variable: '--font-ubuntu_condensed',
  subsets: ['cyrillic'],
  weight: '400',
})

const robotoCondensed = Roboto_Condensed({
  display: 'swap',
  variable: '--font-roboto_condensed',
  subsets: ['cyrillic'],
})

const inter = Inter({
  display: 'swap',
  variable: '--font-inter',
  subsets: ['cyrillic'],
})

const roboto = Roboto({
  display: 'swap',
  variable: '--font-roboto',
  subsets: ['cyrillic'],
  weight: ['300', '400', '500', '700'],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ru'>
      <body className={`${ubuntuCondensed.variable} ${robotoCondensed.variable} ${inter.variable} ${roboto.variable}`}>
        <AppRouterCacheProvider>
          <CssBaseline />
          <ThemeProvider theme={theme}>
            <Container sx={{ height: '100svh' }}>{children}</Container>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
