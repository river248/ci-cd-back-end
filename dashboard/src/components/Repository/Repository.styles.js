import { styled } from '@mui/material/styles'
import MuiCardContent from '@mui/material/CardContent'
import MuiCardActions from '@mui/material/CardActions'

export const CardContent = styled(MuiCardContent)(({ theme }) => ({
    padding: theme.spacing(1),
}))

export const CardActions = styled(MuiCardActions)(() => ({
    justifyContent: 'space-between',
}))
