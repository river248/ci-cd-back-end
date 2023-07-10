import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import { useTheme } from '@mui/material/styles'

import { useQueryHook } from '~/hooks'
import Title from '~/components/Title'
import routes from '~/configs/routes'
import StageContainer from '~/containers/StageContainer'
import { handleFetchFullPipeline, handleUpdateStageData } from '~/redux/async-logics/pipelineLogic'
import { processName, socket, socketEvent } from '~/utils/constants'
import Stage from '~/components/Stage'

function Pipeline({ stages, loading, getFullPipeline, updateStageData }) {
    const query = useQueryHook()
    const theme = useTheme()
    const navigate = useNavigate()

    useEffect(() => {
        socket.connect()
        socket.on(socketEvent.UPDATE_PIPELINE_DATA, (data) => {
            updateStageData(data)
        })

        return () => {
            socket.disconnect()
            socket.off(socketEvent.UPDATE_PIPELINE_DATA)
        }
    }, [])

    useEffect(() => {
        getFullPipeline(query.get('repo'))
        socket.emit(socketEvent.USING_PIPELINE, query.get('repo'))

        return () => {
            socket.off(socketEvent.USING_PIPELINE)
        }
    }, [query.get('repo')])

    return (
        <Box paddingX={2} paddingY={1}>
            <Stack direction={'row'} alignItems={'center'}>
                <IconButton sx={{ marginRight: 1 }} onClick={() => navigate(routes.dashboard, { replace: true })}>
                    <ArrowBackIcon sx={{ color: theme.palette.common.white, fontSize: 30 }} />
                </IconButton>
                <Title content={query.get('repo')} />
            </Stack>

            <Stack direction={'row'} alignItems={'flex-start'} spacing={2}>
                {loading ? (
                    <Fragment>
                        <Stage name={'build'} loading />
                        <Stage name={'test'} loading />
                        <Stage name={'prod'} loading />
                    </Fragment>
                ) : (
                    <Fragment>
                        {stages.map((stage) => (
                            <StageContainer key={stage.name} stage={stage} />
                        ))}
                    </Fragment>
                )}
            </Stack>
        </Box>
    )
}

Pipeline.propTypes = {
    stages: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string,
            repository: PropTypes.string,
            name: PropTypes.string,
            executionId: PropTypes.string,
            version: PropTypes.string,
            status: PropTypes.oneOf([
                processName.QUEUED,
                processName.IN_PROGRESS,
                processName.SUCCESS,
                processName.FAILURE,
            ]),
            codePipelineBranch: PropTypes.string,
            metrics: PropTypes.arrayOf(
                PropTypes.shape({
                    _id: PropTypes.string,
                    name: PropTypes.string,
                    rank: PropTypes.number,
                    actual: PropTypes.number,
                    total: PropTypes.number,
                    status: PropTypes.oneOf([
                        processName.QUEUED,
                        processName.IN_PROGRESS,
                        processName.SUCCESS,
                        processName.FAILURE,
                    ]),
                    appMetrics: PropTypes.arrayOf(
                        PropTypes.shape({
                            name: PropTypes.string,
                            actual: PropTypes.number,
                            total: PropTypes.number,
                            reportUrl: PropTypes.string,
                        }),
                    ),
                    completedAt: PropTypes.string,
                    executionId: PropTypes.string,
                    startedAt: PropTypes.string,
                }),
            ),
            commitId: PropTypes.string,
            deploymentId: PropTypes.string,
            buildStartTime: PropTypes.string,
            endDateTime: PropTypes.string,
            startDateTime: PropTypes.string,
        }),
    ),
    loading: PropTypes.bool,
    getFullPipeline: PropTypes.func,
    updateStageData: PropTypes.func,
}

const mapStateToProps = (state) => ({
    loading: state.pipeline.loading,
    stages: state.pipeline.stages,
})

const mapDispatchToProps = (dispatch) => ({
    getFullPipeline: (repo) => {
        dispatch(handleFetchFullPipeline(repo))
    },
    updateStageData: (data) => {
        dispatch(handleUpdateStageData(data))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(Pipeline)
