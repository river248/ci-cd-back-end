import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import { useTheme } from '@mui/material/styles'

import { useQueryHook } from '~/hooks'
import Title from '~/components/Title'
import routes from '~/configs/routes'
import { processName } from '~/utils/constants'
import StageContainer from '~/containers/StageContainer'

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
        startTime: '2023-06-27T10:58:44.117354',
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

            <StageContainer latesBuild={latesBuild ?? {}} metrics={metrics} />
        </Box>
    )
}

export default Pipeline
