import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

import { processName } from '~/utils/constants'
import StatusIcon from '~/components/StatusIcon'

function Metric({ name, actual, total, status, hasPopup, onOpen }) {
    const theme = useTheme()
    return (
        <Stack marginTop={1} direction={'row'}>
            <Box flexGrow={1}>
                <Typography variant={'h6'} component={'div'} fontWeight={'normal'} fontSize={14}>
                    {name}
                </Typography>
                <Box>
                    {hasPopup ? (
                        <Typography
                            variant={'h6'}
                            component={'span'}
                            fontWeight={'normal'}
                            fontSize={14}
                            sx={{ cursor: 'pointer', color: theme.palette.primary.main }}
                            onClick={() => onOpen(name)}
                        >
                            {actual ?? '?'}/{total ?? '?'}
                        </Typography>
                    ) : (
                        <Typography variant={'h6'} component={'span'} fontWeight={'normal'} fontSize={14}>
                            {actual ?? '?'}/{total ?? '?'}
                        </Typography>
                    )}
                </Box>
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
    hasPopup: PropTypes.bool,
    onOpen: PropTypes.func,
}

export default React.memo(Metric)
