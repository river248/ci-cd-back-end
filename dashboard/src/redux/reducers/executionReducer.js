import { createReducer } from '@reduxjs/toolkit'

import { EXECUTION_LOADING, GET_EXECUTIONS_BY_DATE } from '~/redux/types/executionType'

const initialState = {
    loading: false,
    executions: [],
}

const executionReducer = createReducer(initialState, (builder) => {
    builder.addCase(EXECUTION_LOADING, (state, action) => {
        state.loading = action.payload
    })
    builder.addCase(GET_EXECUTIONS_BY_DATE, (state, action) => {
        state.executions = action.payload
    })
})

export default executionReducer
