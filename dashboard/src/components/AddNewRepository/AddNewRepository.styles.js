import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import FormControlLabel from '@mui/material/FormControlLabel'

import Input from '~/components/Input'

export const Wrapper = styled(Paper)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    padding: theme.spacing(2),
    width: 320,
}))

export const MuiInput = styled(Input)(({ theme }) => ({
    ' .MuiOutlinedInput-notchedOutline': {
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: theme.palette.text.secondary,
    },
}))

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
