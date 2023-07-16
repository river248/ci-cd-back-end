import { styled } from '@mui/material/styles'
import MuiCardContent from '@mui/material/CardContent'
import MuiCardActions from '@mui/material/CardActions'
import MuiStack from '@mui/material/Stack'

export const CardContent = styled(MuiCardContent)(({ theme }) => ({
    padding: theme.spacing(1),
}))

export const CardActions = styled(MuiCardActions)(() => ({
    justifyContent: 'space-between',
}))

export const CardOverflow = styled('div')(({ theme }) => ({
    height: 109,
    backgroundColor: theme.palette.secondary.dark,
    position: 'relative',
    marginBottom: theme.spacing(7.5),
}))

export const AspectRatio = styled(MuiStack)(({ theme }) => ({
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 80,
    height: 80,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.secondary.dark,
    borderRadius: '50%',
    backgroundColor: theme.palette.common.white,
}))
