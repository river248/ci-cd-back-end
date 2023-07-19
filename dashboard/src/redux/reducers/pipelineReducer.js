import { createReducer } from '@reduxjs/toolkit'
import {
    PIPELINE_LOADING,
    GET_FULL_PIPELINE,
    UPDATE_STAGE_DATA,
    RELISTEN_SOCKET_EVENT,
} from '~/redux/types/pipelineType'

const initialState = {
    loading: false,
    socketListenTime: 0,
    stages: [],
}

const pipelineReducer = createReducer(initialState, (builder) => {
    builder.addCase(PIPELINE_LOADING, (state, action) => {
        state.loading = action.payload
    })
    builder.addCase(GET_FULL_PIPELINE, (state, action) => {
        state.stages = action.payload
    })
    builder.addCase(UPDATE_STAGE_DATA, (state, action) => {
        const index = state.stages.findIndex((stage) => stage.name === action.payload.name)

        if (index >= 0) {
            state.stages[index] = action.payload
        }
    })
    builder.addCase(RELISTEN_SOCKET_EVENT, (state, _action) => {
        state.socketListenTime = state.socketListenTime + 1
    })
})

export default pipelineReducer
