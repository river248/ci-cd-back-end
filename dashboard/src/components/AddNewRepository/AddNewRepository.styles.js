import { styled } from '@mui/material/styles'
import FormControlLabel from '@mui/material/FormControlLabel'

export const MuiLabel = styled(FormControlLabel)(({ theme }) => ({
    padding: theme.spacing(1, 2),
    margin: 0,
    marginTop: theme.spacing(3),
    backgroundColor: theme.palette.secondary.dark,
    width: '100%',
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],

    ' .MuiTypography-root': {
        fontSize: 15,
        width: '100%',
        textAlign: 'center',
        color: theme.palette.common.white,
    },
}))
