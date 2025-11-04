'use client'
import Convert from '@/components/Convert'
import Resize from '@/components/Resize'
import { Stack } from '@mui/material'

function Actions() {
  return (
    <Stack sx={{ marginY: 3, gap: 2 }}>
      <Convert />
        <Resize/>
    </Stack>
  )
}

export default Actions
