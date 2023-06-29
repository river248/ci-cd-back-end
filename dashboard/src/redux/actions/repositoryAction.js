import { createAction } from '@reduxjs/toolkit'

import { GET_ALL_REPOSITORIES, REPOSITORY_LOADING } from '~/redux/types/repositoryType'

export const loading = createAction(REPOSITORY_LOADING)
export const getAllRepositories = createAction(GET_ALL_REPOSITORIES)
