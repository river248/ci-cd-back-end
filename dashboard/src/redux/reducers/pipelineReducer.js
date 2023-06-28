import { createReducer } from '@reduxjs/toolkit'
import { LOADING, GET_FULL_PIPELINE, UPDATE_STAGE_DATA } from '~/redux/types/pipelineType'

const initialState = {
    loading: false,
    stages: [],
}

const pipelineReducer = createReducer(initialState, (builder) => {
    builder.addCase(LOADING, (state, action) => {
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
})

export default pipelineReducer
