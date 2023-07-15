import { createReducer } from '@reduxjs/toolkit'
import { REPOSITORY_LOADING, GET_ALL_REPOSITORIES, ADD_NEW_REPOSITORY } from '~/redux/types/repositoryType'

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
    builder.addCase(ADD_NEW_REPOSITORY, (state, action) => {
        state.repositories.push(action.payload)
    })
})

export default repositoryReducer
