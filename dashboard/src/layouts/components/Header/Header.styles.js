import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'

import Button from '~/components/Button'

export const Wrapper = styled(Paper)(({ theme }) => ({
    borderRadius: 0,
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    padding: theme.spacing(0, 2),
    backgroundColor: theme.palette.secondary.dark,
}))

export const Search = styled(TextField)(({ theme }) => ({
    borderRadius: 4,
    background: theme.palette.common.white,
    width: 250,

    ' .MuiInputBase-input': {
        color: theme.palette.common.black,
    },

    ' .MuiOutlinedInput-notchedOutline': {
        border: 0,
    },

    [theme.breakpoints.down('sm')]: {
        width: 200,
    },
}))

export const Dropdown = styled(Paper)(({ theme }) => ({
    display: 'flex',
    marginTop: theme.spacing(1),
    flexDirection: 'column',
}))

export const DropdownItem = styled(Button)(({ theme }) => ({
    width: 250,
    padding: theme.spacing(1, 2),
    justifyContent: 'flex-start',
}))
