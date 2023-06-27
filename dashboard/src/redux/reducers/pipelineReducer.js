import { createReducer } from '@reduxjs/toolkit'

import { LOADING, GET_FULL_PIPELINE } from '~/redux/types/pipelineType'

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
})

export default pipelineReducer
