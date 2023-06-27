import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'

import { processName } from '~/utils/constants'
import StatusIcon from '~/components/StatusIcon'

function Metric({ name, actual, total, status }) {
    return (
        <Stack marginTop={1} direction={'row'}>
            <Box flexGrow={1}>
                <Typography variant={'h6'} component={'div'} fontWeight={'normal'} fontSize={14}>
                    {name}
                </Typography>
                <Typography variant={'h6'} component={'div'} fontWeight={'normal'} fontSize={14}>
                    {actual ?? '?'}/{total ?? '?'}
                </Typography>
            </Box>
            <StatusIcon status={status} />
        </Stack>
    )
}

Metric.propTypes = {
    name: PropTypes.string.isRequired,
    actual: PropTypes.number,
    total: PropTypes.number,
    status: PropTypes.oneOf([processName.QUEUED, processName.IN_PROGRESS, processName.FAILURE, processName.SUCCESS]),
}

export default React.memo(Metric)
