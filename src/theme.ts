'use client'
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: 'var(--font-ubuntu_condensed)',
  },
  palette: {
    primary: {
      main: '#fff98d',
    },
  },
})

export default theme
