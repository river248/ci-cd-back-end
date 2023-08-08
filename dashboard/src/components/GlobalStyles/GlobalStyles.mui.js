import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'

export const textFieldStyles = (theme) => ({
    borderRadius: theme.shape.borderRadius,
    background: theme.palette.common.white,

    ' .MuiInputBase-input': {
        color: theme.palette.common.black,
        padding: theme.spacing(1.0625, 1.75),
    },

    ' .MuiOutlinedInput-notchedOutline': {
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: theme.palette.text.secondary,
    },
})

export const ModalWrapper = styled(Paper)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    padding: theme.spacing(2),
    width: 320,
}))

export const MuiInput = styled(TextField)(({ theme }) => ({
    ...textFieldStyles(theme),
}))

export const MuiSelect = styled(Select)(({ theme }) => ({
    ...textFieldStyles(theme),
}))

export const NoImage = styled('div')(({ theme }) => ({
    width: '100%',
    height: 140,
    backgroundColor: theme.palette.grey[100],
}))
