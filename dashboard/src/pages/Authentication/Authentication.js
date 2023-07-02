import React from 'react'
import AllInclusiveIcon from '@mui/icons-material/AllInclusive'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import GitHubIcon from '@mui/icons-material/GitHub'
import { toast } from 'react-toastify'
import { useTheme } from '@mui/material/styles'

import { useAuth } from '~/hooks'
import { errorCode } from '~/utils/constants'
import Button from '~/components/Button'

function Authentication() {
    const { signInWithGithub } = useAuth()
    const theme = useTheme()

    const handleSignInWithGithub = () => {
        signInWithGithub().catch((error) => {
            if (error.message === 'auth/popup-closed-by-user') {
                console.log(errorCode[error.message])
            } else {
                toast.error(errorCode[error.message])
            }
        })
    }

    return (
        <Stack alignItems={'center'} justifyContent={'center'} height={'100vh'}>
            <Paper
                sx={{
                    width: '60vw',
                    height: '60vh',
                    backgroundColor: theme.palette.secondary.dark,
                    borderRadius: theme.shape.borderRadius,
                    boxShadow: theme.shadows[10],
                    padding: theme.spacing(2),
                }}
            >
                <Stack height={'100%'} alignItems={'center'} justifyContent={'center'}>
                    <Typography
                        variant={'h1'}
                        component={'h1'}
                        fontWeight={900}
                        fontSize={'4rem'}
                        color={theme.palette.common.white}
                    >
                        Welcome to CI/CD !
                    </Typography>
                    <AllInclusiveIcon sx={{ color: theme.palette.common.white, fontSize: '4rem' }} />
                    <Button
                        startIcon={<GitHubIcon sx={{ color: theme.palette.common.white }} />}
                        defaultText={false}
                        onClick={handleSignInWithGithub}
                    >
                        Sign in with Github
                    </Button>
                </Stack>
            </Paper>
        </Stack>
    )
}

export default Authentication
