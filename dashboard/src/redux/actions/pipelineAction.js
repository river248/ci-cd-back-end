import { createAction } from '@reduxjs/toolkit'

import { GET_FULL_PIPELINE, LOADING } from '~/redux/types/pipelineType'

export const loading = createAction(LOADING)
export const getFullPipeline = createAction(GET_FULL_PIPELINE)
