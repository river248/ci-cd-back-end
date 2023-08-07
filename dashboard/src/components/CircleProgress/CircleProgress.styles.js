import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

export const Container = styled(Box)(() => ({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}))
