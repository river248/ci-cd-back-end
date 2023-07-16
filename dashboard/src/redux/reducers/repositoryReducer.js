import { createReducer } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'
import {
    REPOSITORY_LOADING,
    GET_ALL_REPOSITORIES,
    ADD_NEW_REPOSITORY,
    REMOVE_REPOSITORY,
} from '~/redux/types/repositoryType'

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
    builder.addCase(REMOVE_REPOSITORY, (state, action) => {
        const cloneRepos = cloneDeep(state.repositories)
        const index = cloneRepos.findIndex((repo) => repo.name === action.payload)

        if (index < 0) {
            throw new Error(`Not found repository: ${action.payload}`)
        }

        cloneRepos.splice(index, 1)
        state.repositories = cloneRepos
    })
})

export default repositoryReducer
