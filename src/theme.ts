'use client'
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: 'var(--font-ubuntu_condensed)',
  },
  palette: {
    primary: {
      main: '#FF8DA1',
    },
  },
})

export default theme
