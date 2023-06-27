import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { isEmpty } from 'lodash'

import { useQueryHook } from '~/hooks'
import Title from '~/components/Title'
import routes from '~/configs/routes'
import BuildActionContainer from '~/containers/BuildActionContainer'
import LatesBuild from '~/components/LatesBuild'
import { processName } from '~/utils/constants'
import Metric from '~/components/Metric'

function Pipeline() {
    const query = useQueryHook()
    const theme = useTheme()
    const navigate = useNavigate()

    const metrics = useMemo(
        () => [
            { name: 'Code Quality', actual: 10, total: 10, status: processName.SUCCESS },
            { name: 'Unit Tests', actual: 10, total: 10, status: processName.IN_PROGRESS },
            { name: 'Unit Test Coverage', actual: 10, total: 10, status: processName.QUEUED },
        ],
        [],
    )

    const latesBuild = useMemo(() => ({
        branch: 'master',
        version: '0.0.1',
        commit: 'abc123',
        startTime: new Date(),
        duration: '5m 6s',
    }))

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

                            {!isEmpty(latesBuild) && <LatesBuild data={latesBuild} />}
                        </Paper>
                    </Box>

                    <Box marginTop={1}>
                        <Paper sx={{ padding: 1 }}>
                            <Typography variant={'h6'} component={'span'} fontSize={14}>
                                METRICS
                            </Typography>
                            {!isEmpty(metrics) &&
                                metrics.map((metric) => (
                                    <Metric
                                        key={metric.name}
                                        data={{
                                            name: metric.name,
                                            actual: metric.actual,
                                            total: metric.total,
                                            status: metric.status,
                                        }}
                                    />
                                ))}
                        </Paper>
                    </Box>
                </Paper>
            </Stack>
        </Box>
    )
}

export default Pipeline
