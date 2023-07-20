import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

export const Wrapper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
    backgroundColor: theme.palette.grey[300],
    width: 270,
}))

export const Header = styled(Typography)(({ theme }) => ({
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    fontSize: 16,
    textAlign: 'center',
}))
