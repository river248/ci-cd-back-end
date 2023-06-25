import { experimental_extendTheme as extendTheme } from '@mui/material/styles'

const theme = extendTheme({
    colorSchemes: {
        light: {
            palette: {
                secondary: { main: '#096386', light: '#00b7a8', dark: '#0c084c' },
            },
        },
    },
})

export default theme
