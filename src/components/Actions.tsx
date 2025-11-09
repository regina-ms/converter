'use client'
import Convert from '@/components/Convert'
import Resize from '@/components/Resize'
import { ActionContext } from '@/features/ActionContext'
import { transformFiles } from '@/methods/transformFiles'
import { Stack } from '@mui/material'
import Button from '@mui/material/Button'
import { useContext } from 'react'

function Actions() {
    const {actions, input} = useContext(ActionContext)

    const goActions = () => {
        const fileNames = input.data.map((image) => image.name)
        transformFiles({fileNames, actions})
    }


    if(!input.data.length) return null
  return (
    <>
        <Stack marginTop={6} marginBottom={4} direction='row' justifyContent='space-between' alignItems='center'>
            <Convert />
            <Resize/>
        </Stack>
        <Button variant='outlined' size='large' sx={{width: 'fit-content' }} onClick={goActions}>Поехали!</Button>
    </>
  )
}

export default Actions
