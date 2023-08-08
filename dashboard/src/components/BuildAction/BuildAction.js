import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { useTheme } from '@mui/material/styles'

import Button from '~/components/Button'
import { MuiInput } from '~/components/GlobalStyles/GlobalStyles.mui'

function BuildAction({ disableTrigger, disableStop, branch, onSetBranch, onTrigger, onStop }) {
    const theme = useTheme()

    return (
        <Paper sx={{ padding: theme.spacing(1) }}>
            <MuiInput placeholder={'branch-name'} fullWidth value={branch} onChange={onSetBranch} />
            <Stack marginTop={1} direction={'row'} spacing={1}>
                <Button
                    disabled={disableTrigger}
                    sx={{ fontSize: 13 }}
                    variant={'contained'}
                    defaultText={false}
                    fullWidth
                    disableElevation
                    onClick={onTrigger}
                >
                    trigger
                </Button>
                <Button
                    disabled={disableStop}
                    sx={{ fontSize: 13 }}
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
    disableTrigger: PropTypes.bool,
    disableStop: PropTypes.bool,
    branch: PropTypes.string,
    onSetBranch: PropTypes.func,
    onTrigger: PropTypes.func,
    onStop: PropTypes.func,
}

export default React.memo(BuildAction)
