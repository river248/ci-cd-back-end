import { createAction } from '@reduxjs/toolkit'

import {
    GET_ALL_REPOSITORIES,
    REPOSITORY_LOADING,
    ADD_NEW_REPOSITORY,
    REMOVE_REPOSITORY,
} from '~/redux/types/repositoryType'

export const loading = createAction(REPOSITORY_LOADING)
export const getAllRepositories = createAction(GET_ALL_REPOSITORIES)
export const addNewRepository = createAction(ADD_NEW_REPOSITORY)
export const removeRepository = createAction(REMOVE_REPOSITORY)
