import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

import BuildActionContainer from '~/containers/BuildActionContainer'
import LatestBuildContainer from '~/containers/LatestBuildContainer'
import MetricContainer from '~/containers/MetricContainer'
import StatusIcon from '~/components/StatusIcon'
import { processName } from '~/utils/constants'
import StageCard from '~/components/StageCard'

function Stage({ name, status, loading }) {
    const theme = useTheme()

    const fakeLatestBuild = useMemo(
        () => [
            { titleWidth: 70, valueWidth: 110 },
            { titleWidth: 72, valueWidth: 80 },
            { titleWidth: 74, valueWidth: 80 },
            { titleWidth: 90, valueWidth: 120 },
            { titleWidth: 73, valueWidth: 60 },
        ],
        [],
    )

    const fakeMetrics = useMemo(
        () => [
            { titleWidth: 100, valueWidth: 50 },
            { titleWidth: 80, valueWidth: 50 },
            { titleWidth: 140, valueWidth: 50 },
        ],
        [],
    )

    if (loading) {
        return (
            <StageCard>
                <Skeleton variant={'text'} width={100} sx={{ margin: '0 auto', fontSize: '1.8rem' }} />
                <Paper sx={{ padding: 1 }}>
                    <Skeleton variant={'rounded'} height={40} />
                    <Stack marginTop={1} spacing={1} direction={'row'}>
                        <Skeleton variant={'rounded'} width={'50%'} height={40} />
                        <Skeleton variant={'rounded'} width={'50%'} height={40} />
                    </Stack>
                </Paper>
                <Paper sx={{ marginTop: 1, padding: 1 }}>
                    <Stack marginBottom={2} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                        <Skeleton variant={'text'} width={120} sx={{ fontSize: '1.5rem' }} />
                        <Skeleton variant={'circular'} width={20} height={20} />
                    </Stack>
                    {fakeLatestBuild.map((item) => (
                        <Stack key={item.titleWidth} marginTop={1} direction={'row'}>
                            <Box width={100}>
                                <Skeleton variant={'rounded'} height={15} width={item.titleWidth} />
                            </Box>
                            <Skeleton variant={'rounded'} height={15} width={item.valueWidth} />
                        </Stack>
                    ))}
                </Paper>
                <Paper sx={{ marginTop: 1, padding: 1 }}>
                    <Skeleton variant={'text'} width={90} sx={{ fontSize: '1.5rem' }} />
                    {fakeMetrics.map((item) => (
                        <Stack key={item.titleWidth} marginTop={2} direction={'row'}>
                            <Box flexGrow={1}>
                                <Skeleton
                                    variant={'rounded'}
                                    width={item.titleWidth}
                                    height={15}
                                    sx={{ marginBottom: 0.5 }}
                                />
                                <Skeleton variant={'rounded'} width={item.valueWidth} height={15} />
                            </Box>
                            <Skeleton variant={'circular'} width={20} height={20} />
                        </Stack>
                    ))}
                </Paper>
            </StageCard>
        )
    }

    return (
        <StageCard title={name}>
            {name.toUpperCase() === 'BUILD' && <BuildActionContainer />}
            <Box marginTop={1}>
                <Paper sx={{ padding: theme.spacing(1) }}>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography variant={'h6'} component={'span'} fontSize={14}>
                            LATEST BUILD
                        </Typography>
                        <StatusIcon status={status} />
                    </Stack>
                    <LatestBuildContainer />
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
        </StageCard>
    )
}

Stage.propTypes = {
    name: PropTypes.string.isRequired,
    status: PropTypes.oneOf([processName.QUEUED, processName.IN_PROGRESS, processName.FAILURE, processName.SUCCESS]),
    loading: PropTypes.bool,
}

export default React.memo(Stage)
