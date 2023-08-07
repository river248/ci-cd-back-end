import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import { useTheme } from '@mui/material/styles'
import { cloneDeep } from 'lodash'
import { connect } from 'react-redux'

import CircleProgress from '~/components/CircleProgress'
import ExecutionTableContainer from '~/containers/ExecutionTableContainer'
import Header from '~/components/Title'
import { handleGetExecutionsByDate } from '~/redux/async-logics/executionLogic'
import ExecutionChartContainer from '~/containers/ExecutionChartContainer'
import { processName } from '~/utils/constants'
import { EXECUTION } from '~/utils/apiPropTypes'

function Executions({ loading, executions, getExecutionsByDate }) {
    const theme = useTheme()

    const successExecutions = useMemo(
        () => executions.filter((execution) => execution.status === processName.SUCCESS),
        [JSON.stringify(executions)],
    )
    const failureExecutions = useMemo(
        () => executions.filter((execution) => execution.status === processName.FAILURE),
        [JSON.stringify(executions)],
    )
    const charts = useMemo(() => {
        const success = successExecutions.length
        const failure = failureExecutions.length
        const total = successExecutions.length + failureExecutions.length
        const successPercent = ((successExecutions.length / total) * 100).toFixed(2) * 1
        const failurePercent = (100 - successPercent).toFixed(2) * 1

        return [
            { id: 'success', value: cloneDeep(successExecutions), percent: successPercent, actual: success, total },
            { id: 'error', value: cloneDeep(failureExecutions), percent: failurePercent, actual: failure, total },
        ]
    }, [JSON.stringify(successExecutions), JSON.stringify(failureExecutions)])

    useEffect(() => {
        getExecutionsByDate('ci-cd-github-actions-test-1', '2023-07-01', '2023-07-31')
    }, [])

    return (
        <Box paddingBottom={2}>
            <Header content={'Executions'} />

            <Stack direction={'row'} justifyContent={'center'} spacing={3} margin={'0 auto'} marginY={3} width={'95%'}>
                {charts.map((chart) => (
                    <Stack
                        key={chart.id}
                        direction={'column'}
                        alignItems={'center'}
                        boxShadow={theme.shadows[4]}
                        borderRadius={1}
                        paddingX={1}
                        paddingY={2}
                        sx={{ width: '50%', backgroundColor: theme.palette.common.white }}
                    >
                        <Typography component={'div'} marginBottom={2}>
                            <strong>Total {chart.id}:</strong> {chart.actual} / {chart.total}
                        </Typography>
                        <CircleProgress size={100} value={chart.percent} fontSize={20} color={chart.id} />
                    </Stack>
                ))}
            </Stack>

            <Stack direction={'row'} justifyContent={'center'} spacing={3} margin={'0 auto'} marginY={3} width={'95%'}>
                {charts.map((chart) => (
                    <Stack
                        key={chart.id}
                        direction={'column'}
                        alignItems={'center'}
                        boxShadow={theme.shadows[4]}
                        borderRadius={1}
                        paddingX={1}
                        paddingY={2}
                        sx={{ height: 400, width: '50%', backgroundColor: theme.palette.common.white }}
                    >
                        <ExecutionChartContainer
                            chartName={`${chart.id} executions`}
                            backgroundColor={chart.backgroundColor}
                            borderColor={chart.borderColor}
                            executions={chart.value}
                        />
                    </Stack>
                ))}
            </Stack>

            <Paper sx={{ width: '95%', margin: '0 auto', boxShadow: 4 }}>
                <ExecutionTableContainer executions={executions} />
            </Paper>
        </Box>
    )
}

ExecutionTableContainer.propTypes = {
    loading: PropTypes.bool,
    getExecutionsByDate: PropTypes.func,
    executions: PropTypes.arrayOf(EXECUTION),
}

const mapStateToProps = (state) => ({
    loading: state.execution.loading,
    executions: state.execution.executions,
})

const mapDispatchToProps = (dispatch) => ({
    getExecutionsByDate: (repository, startDateTime, endDateTime) => {
        dispatch(handleGetExecutionsByDate(repository, startDateTime, endDateTime))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(Executions)
