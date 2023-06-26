import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useTheme } from '@mui/material/styles'

import Button from '~/components/Button'

function BuildAction({ disabled, branch, onSetBranch, onTrigger, onStop }) {
    const theme = useTheme()

    return (
        <Paper sx={{ padding: theme.spacing(1) }}>
            <TextField
                size={'small'}
                placeholder={'branch-name'}
                sx={{ background: theme.palette.common.white }}
                fullWidth
                value={branch}
                onChange={onSetBranch}
            />
            <Stack marginTop={1} direction={'row'} spacing={1}>
                <Button
                    disabled={disabled}
                    sx={{ fontSize: 12 }}
                    variant={'contained'}
                    defaultText={false}
                    fullWidth
                    disableElevation
                    onClick={onTrigger}
                >
                    trigger
                </Button>
                <Button
                    disabled={disabled}
                    sx={{ fontSize: 12 }}
                    variant={'contained'}
                    defaultText={false}
                    fullWidth
                    disableElevation
                    onClick={onStop}
                >
                    stop
                </Button>
            </Stack>
        </Paper>
    )
}

BuildAction.propTypes = {
    disabled: PropTypes.bool,
    branch: PropTypes.string,
    onSetBranch: PropTypes.func,
    onTrigger: PropTypes.func,
    onStop: PropTypes.func,
}

export default React.memo(BuildAction)
