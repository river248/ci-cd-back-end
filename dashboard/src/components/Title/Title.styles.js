import { styled } from '@mui/material/styles'

export const MuiTitle = styled('h1')(({ theme }) => ({
    textAlign: 'center',
    padding: theme.spacing(1),
    color: theme.palette.common.white,
}))
