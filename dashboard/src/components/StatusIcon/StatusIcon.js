import React from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import CircleIcon from '@mui/icons-material/Circle'
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@mui/material/styles'

import { processName } from '~/utils/constants'

function StatusIcon({ status }) {
    const theme = useTheme()

    switch (status) {
        case processName.QUEUED:
            return <AccessTimeFilledIcon sx={{ color: theme.palette.warning.main }} />
        case processName.IN_PROGRESS:
            return (
                <Box
                    display={'flex'}
                    width={24}
                    height={24}
                    justifyContent={'center'}
                    alignItems={'center'}
                    sx={{ position: 'relative' }}
                >
                    <CircleIcon sx={{ color: theme.palette.warning.light, fontSize: 18 }} />
                    <CircularProgress
                        size={24}
                        sx={{
                            color: theme.palette.warning.light,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            zIndex: 1,
                        }}
                        disableShrink
                    />
                </Box>
            )
        case processName.SUCCESS:
            return <CheckCircleIcon sx={{ color: theme.palette.success.main }} />
        case processName.FAILURE:
            return <RemoveCircleIcon sx={{ color: theme.palette.error.main }} />
        default:
            return null
    }
}

StatusIcon.propTypes = {
    status: PropTypes.oneOf([processName.QUEUED, processName.IN_PROGRESS, processName.FAILURE, processName.SUCCESS]),
}

export default React.memo(StatusIcon)
