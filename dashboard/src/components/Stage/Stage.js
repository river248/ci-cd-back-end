import React from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useTheme } from '@mui/material/styles'

import BuildActionContainer from '~/containers/BuildActionContainer'
import LatesBuildContainer from '~/containers/LatesBuildContainer'
import MetricContainer from '~/containers/MetricContainer'

function Stage() {
    const theme = useTheme()

    return (
        <Stack direction={'row'} spacing={2}>
            <Paper sx={{ padding: theme.spacing(1), backgroundColor: theme.palette.grey[300], width: 270 }}>
                <Typography
                    padding={1}
                    marginBottom={1}
                    variant={'h6'}
                    component={'div'}
                    fontSize={16}
                    textAlign={'center'}
                >
                    BUILD
                </Typography>

                <BuildActionContainer />

                <Box marginTop={1}>
                    <Paper sx={{ padding: theme.spacing(1) }}>
                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                            <Typography variant={'h6'} component={'span'} fontSize={14}>
                                LATEST BUILD
                            </Typography>
                            <CheckCircleIcon sx={{ color: theme.palette.success.main }} />
                        </Stack>
                        <LatesBuildContainer />
                    </Paper>
                </Box>

                <Box marginTop={1}>
                    <Paper sx={{ padding: 1 }}>
                        <Typography variant={'h6'} component={'span'} fontSize={14}>
                            METRICS
                        </Typography>
                        <MetricContainer />
                    </Paper>
                </Box>
            </Paper>
        </Stack>
    )
}

export default React.memo(Stage)
