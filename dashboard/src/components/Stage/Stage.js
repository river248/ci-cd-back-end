import React from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

import BuildActionContainer from '~/containers/BuildActionContainer'
import LatesBuildContainer from '~/containers/LatesBuildContainer'
import MetricContainer from '~/containers/MetricContainer'
import StatusIcon from '~/components/StatusIcon'
import { processName } from '~/utils/constants'

function Stage({ name, status }) {
    const theme = useTheme()

    return (
        <Paper sx={{ padding: theme.spacing(1), backgroundColor: theme.palette.grey[300], width: 270 }}>
            <Typography
                padding={1}
                marginBottom={1}
                variant={'h6'}
                component={'div'}
                fontSize={16}
                textAlign={'center'}
            >
                {name.toUpperCase()}
            </Typography>

            {name.toUpperCase() === 'BUILD' && <BuildActionContainer />}

            <Box marginTop={1}>
                <Paper sx={{ padding: theme.spacing(1) }}>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography variant={'h6'} component={'span'} fontSize={14}>
                            LATEST BUILD
                        </Typography>
                        <StatusIcon status={status} />
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
    )
}
Stage.propTypes = {
    name: PropTypes.string.isRequired,
    status: PropTypes.oneOf([processName.QUEUED, processName.IN_PROGRESS, processName.FAILURE, processName.SUCCESS]),
}

export default React.memo(Stage)
