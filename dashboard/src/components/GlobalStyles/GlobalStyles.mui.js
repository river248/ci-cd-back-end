import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'

import Input from '~/components/Input'

export const ModalWrapper = styled(Paper)(({ theme }) => ({
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

export const NoImage = styled('div')(({ theme }) => ({
    width: '100%',
    height: 140,
    backgroundColor: theme.palette.grey[100],
}))
