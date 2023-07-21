import React from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import { useTheme } from '@mui/material/styles'
import { isEmpty } from 'lodash'

import Button from '~/components/Button'
import StageCard from '~/components/StageCard'

function ProceedToProd({ version, disabled, loading, onApproveOrReject }) {
    const theme = useTheme()
    const APPROVE = theme.palette.success.main
    const REJECT = theme.palette.error.main

    if (loading) {
        return (
            <StageCard>
                <Skeleton variant={'text'} width={160} sx={{ margin: '0 auto', fontSize: '1.8rem' }} />
                <Paper sx={{ padding: 1, marginTop: 1 }}>
                    <Skeleton variant={'text'} />
                    <Skeleton variant={'text'} />
                    <Skeleton variant={'text'} width={100} />
                </Paper>
                <Stack direction={'row'} spacing={1} marginTop={1}>
                    <Skeleton variant={'rounded'} width={'50%'} height={40} />
                    <Skeleton variant={'rounded'} width={'50%'} height={40} />
                </Stack>
            </StageCard>
        )
    }

    return (
        <StageCard title={'Deploy to production'}>
            <Box marginTop={1}>
                <Paper sx={{ padding: 1 }}>
                    {!isEmpty(version) ? (
                        <Typography variant={'span'} component={'div'} fontSize={14}>
                            Install version{' '}
                            <Typography
                                variant={'span'}
                                component={'span'}
                                color={theme.palette.info.main}
                                fontWeight={600}
                            >
                                {version}
                            </Typography>{' '}
                            on production by clicking{' '}
                            <Typography variant={'span'} component={'span'} color={APPROVE} fontWeight={600}>
                                approve
                            </Typography>{' '}
                            button. If you don't want to do that, please click{' '}
                            <Typography variant={'span'} component={'span'} color={REJECT} fontWeight={600}>
                                reject
                            </Typography>{' '}
                            button.
                        </Typography>
                    ) : (
                        <Typography variant={'span'} component={'div'} fontSize={14}>
                            There is no version which can proceed to production.
                        </Typography>
                    )}
                </Paper>
            </Box>
            <Stack marginTop={1} direction={'row'} spacing={1}>
                <Button
                    sx={{
                        backgroundColor: REJECT,
                        boxShadow: theme.shadows[1],
                        ':hover': { backgroundColor: REJECT },
                    }}
                    disabled={disabled}
                    variant={'contained'}
                    fullWidth
                    defaultText={false}
                    onClick={() => onApproveOrReject(version, false)}
                >
                    Reject
                </Button>
                <Button
                    sx={{
                        backgroundColor: APPROVE,
                        boxShadow: theme.shadows[1],
                        ':hover': { backgroundColor: APPROVE },
                    }}
                    disabled={disabled}
                    variant={'contained'}
                    fullWidth
                    defaultText={false}
                    onClick={() => onApproveOrReject(version, true)}
                >
                    Approve
                </Button>
            </Stack>
        </StageCard>
    )
}

ProceedToProd.propTypes = {
    version: PropTypes.string,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    onApproveOrReject: PropTypes.func,
}

export default React.memo(ProceedToProd)
