import { styled } from '@mui/material/styles'

export const Content = styled('span')(({ theme, uppercase, italic, defaultText }) => ({
    textTransform: uppercase === 'true' ? 'uppercase' : 'none',
    paddingTop: theme.spacing(0.2),
    fontStyle: italic === 'true' ? 'italic' : 'unset',
    color: defaultText === 'true' ? theme.palette.common.black : theme.palette.common.white,
}))
