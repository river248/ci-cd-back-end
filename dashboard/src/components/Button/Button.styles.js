import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'

export const MuiButton = styled(Button)(({ uppercase }) => ({
    textTransform: uppercase === true ? 'uppercase' : 'none',
}))

export const Content = styled('span')(({ theme, italic }) => ({
    paddingTop: theme.spacing(0.2),
    fontStyle: italic ? 'italic' : 'unset',
    color: theme.palette.common.black,
}))
