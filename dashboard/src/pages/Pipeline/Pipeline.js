import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import { useTheme } from '@mui/material/styles'
import { toast } from 'react-toastify'

import { useAuth, useQueryHook } from '~/hooks'
import Title from '~/components/Title'
import routes from '~/configs/routes'
import StageContainer from '~/containers/StageContainer'
import { handleFetchFullPipeline, handleUpdateStageData } from '~/redux/async-logics/pipelineLogic'
import { socket, socketEvent } from '~/utils/constants'
import Stage from '~/components/Stage'
import ProceedToProdContainer from '~/containers/ProceedToProdContainer'
import ImageToastify from '~/components/ImageToastify'
import QueueBuildContainer from '~/containers/QueueBuildContainer'
import QueueBuild from '~/components/QueueBuild'
import ProceedToProd from '~/components/ProceedToProd'
import { STAGE } from '~/utils/apiPropTypes'

function Pipeline({ stages, loading, socketListenTime, getFullPipeline, updateStageData }) {
    const query = useQueryHook()
    const theme = useTheme()
    const navigate = useNavigate()
    const { user } = useAuth()
    const REPOSITORY = query.get('repo')

    useEffect(() => {
        socket.connect()
        socket.on(socketEvent.UPDATE_PIPELINE_DATA, (data) => {
            updateStageData(data)
        })
        socket.on(socketEvent.TRIGGER_PIPELINE, (userData) => {
            if (userData.userId !== user.userId) {
                toast.info(
                    <ImageToastify
                        image={userData.avatar}
                        content={`<strong>${userData.name}</strong> has just triggered pipeline !`}
                    />,
                    { icon: false },
                )
            }
        })
        socket.on(socketEvent.STOP_BUILD, (userData) => {
            if (userData.userId !== user.userId) {
                toast.info(
                    <ImageToastify
                        image={userData.avatar}
                        content={`<strong>${userData.name}</strong> has just stopped build !`}
                    />,
                    { icon: false },
                )
            }
        })
        return () => {
            socket.disconnect()
            socket.off(socketEvent.UPDATE_PIPELINE_DATA)
            socket.off(socketEvent.TRIGGER_PIPELINE)
            socket.off(socketEvent.STOP_BUILD)
        }
    }, [])

    useEffect(() => {
        getFullPipeline(REPOSITORY)
    }, [REPOSITORY])

    useEffect(() => {
        socket.emit(socketEvent.USING_PIPELINE, REPOSITORY)

        return () => {
            socket.off(socketEvent.USING_PIPELINE)
        }
    }, [REPOSITORY, socketListenTime])

    return (
        <Box paddingX={2} paddingY={1}>
            <Stack direction={'row'} alignItems={'center'}>
                <IconButton sx={{ marginRight: 1 }} onClick={() => navigate(routes.dashboard, { replace: true })}>
                    <ArrowBackIcon sx={{ color: theme.palette.common.white, fontSize: 30 }} />
                </IconButton>
                <Title content={REPOSITORY} />
            </Stack>

            <Stack direction={'row'} alignItems={'flex-start'} spacing={2}>
                {loading ? (
                    <Fragment>
                        <QueueBuild tagNames={['1', '2', '3', '4', '5']} loading />
                        <Stage name={'build'} loading />
                        <Stage name={'test'} loading />
                        <Stage name={'prod'} loading />
                        <ProceedToProd loading />
                    </Fragment>
                ) : (
                    <Fragment>
                        <QueueBuildContainer />
                        {stages.map((stage) => (
                            <StageContainer key={stage.name} stage={stage} />
                        ))}
                        <ProceedToProdContainer />
                    </Fragment>
                )}
            </Stack>
        </Box>
    )
}

Pipeline.propTypes = {
    stages: PropTypes.arrayOf(STAGE),
    loading: PropTypes.bool,
    socketListenTime: PropTypes.number,
    getFullPipeline: PropTypes.func,
    updateStageData: PropTypes.func,
}

const mapStateToProps = (state) => ({
    loading: state.pipeline.loading,
    stages: state.pipeline.stages,
    socketListenTime: state.pipeline.socketListenTime,
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
