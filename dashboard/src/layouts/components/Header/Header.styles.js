import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'

import Button from '~/components/Button'
import Input from '~/components/Input'

export const Wrapper = styled(Paper)(({ theme }) => ({
    borderRadius: 0,
    position: 'fixed',
    zIndex: 100,
    top: 0,
    left: 0,
    width: '100%',
    padding: theme.spacing(0, 2),
    backgroundColor: theme.palette.secondary.dark,
}))

export const Search = styled(Input)(({ theme }) => ({
    width: 250,

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
