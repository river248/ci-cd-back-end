import { createReducer } from '@reduxjs/toolkit'
import { REPOSITORY_LOADING, GET_ALL_REPOSITORIES } from '~/redux/types/repositoryType'

const initialState = {
    loading: false,
    repositories: [],
}

const repositoryReducer = createReducer(initialState, (builder) => {
    builder.addCase(REPOSITORY_LOADING, (state, action) => {
        state.loading = action.payload
    })
    builder.addCase(GET_ALL_REPOSITORIES, (state, action) => {
        state.repositories = action.payload
    })
})

export default repositoryReducer
