import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

import { useQueryHook } from '~/hooks'
import Title from '~/components/Title'
import routes from '~/configs/routes'
import BuildActionContainer from '~/containers/BuildActionContainer'

function Pipeline() {
    const query = useQueryHook()
    const theme = useTheme()
    const navigate = useNavigate()

    return (
        <Box paddingX={2} paddingY={1}>
            <Stack direction={'row'} alignItems={'center'}>
                <IconButton sx={{ marginRight: 1 }} onClick={() => navigate(routes.dashboard, { replace: true })}>
                    <ArrowBackIcon sx={{ color: theme.palette.common.white, fontSize: 30 }} />
                </IconButton>
                <Title content={query.get('repo')} />
            </Stack>
            <Stack direction={'row'} spacing={2}>
                <Paper sx={{ padding: theme.spacing(1), backgroundColor: theme.palette.grey[300], width: 270 }}>
                    <Stack
                        padding={1}
                        marginBottom={1}
                        direction={'row'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                    >
                        <Typography variant={'h6'} component={'span'} fontSize={15}>
                            BUILD
                        </Typography>
                        <Typography variant={'h6'} component={'span'} fontSize={15}>
                            0.0.1
                        </Typography>
                        <CheckCircleIcon sx={{ color: theme.palette.success.main }} />
                    </Stack>

                    <BuildActionContainer />
                </Paper>
            </Stack>
        </Box>
    )
}

export default Pipeline
