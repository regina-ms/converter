'use client'
import Convert from '@/components/Convert'
import { Stack } from '@mui/material'

function Actions() {
  return (
    <Stack direction='row' sx={{ marginY: 3 }}>
      <Convert />
    </Stack>
  )
}

export default Actions
