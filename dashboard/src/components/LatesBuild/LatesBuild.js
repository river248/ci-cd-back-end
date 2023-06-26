import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { format } from 'date-fns'
import { useTheme } from '@mui/material/styles'

function LatesBuild({ version, commit, startTime, duration }) {
    const theme = useTheme()
    return (
        <Paper sx={{ padding: theme.spacing(1) }}>
            <Typography variant={'h6'} component={'span'} fontSize={14}>
                LATEST BUILD
            </Typography>

            <Stack marginTop={1} direction={'row'}>
                <Typography width={'30%'} variant={'h6'} component={'span'} fontWeight={'normal'} fontSize={14}>
                    Version:
                </Typography>
                <Typography width={'70%'} variant={'h6'} component={'span'} fontWeight={'normal'} fontSize={14}>
                    {version}
                </Typography>
            </Stack>
            <Stack marginTop={1} direction={'row'}>
                <Typography width={'30%'} variant={'h6'} component={'span'} fontWeight={'normal'} fontSize={14}>
                    Commit:
                </Typography>
                <Typography width={'70%'} variant={'h6'} component={'span'} fontWeight={'normal'} fontSize={14}>
                    {commit}
                </Typography>
            </Stack>
            <Stack marginTop={1} direction={'row'}>
                <Typography width={'30%'} variant={'h6'} component={'span'} fontWeight={'normal'} fontSize={14}>
                    Start time:
                </Typography>
                <Typography width={'70%'} variant={'h6'} component={'span'} fontWeight={'normal'} fontSize={14}>
                    {format(startTime, 'dd/MM/yyyy HH:mm')}
                </Typography>
            </Stack>
            <Stack marginTop={1} direction={'row'}>
                <Typography width={'30%'} variant={'h6'} component={'span'} fontWeight={'normal'} fontSize={14}>
                    Duration:
                </Typography>
                <Typography width={'70%'} variant={'h6'} component={'span'} fontWeight={'normal'} fontSize={14}>
                    {duration}
                </Typography>
            </Stack>
        </Paper>
    )
}

LatesBuild.propTypes = {
    version: PropTypes.string.isRequired,
    commit: PropTypes.string.isRequired,
    startTime: PropTypes.instanceOf(Date).isRequired,
    duration: PropTypes.string,
}

export default React.memo(LatesBuild)
