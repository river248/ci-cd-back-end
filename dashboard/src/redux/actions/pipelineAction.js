import { createAction } from '@reduxjs/toolkit'

import { GET_FULL_PIPELINE, PIPELINE_LOADING, UPDATE_STAGE_DATA } from '~/redux/types/pipelineType'

export const loading = createAction(PIPELINE_LOADING)
export const getFullPipeline = createAction(GET_FULL_PIPELINE)
export const updateStageData = createAction(UPDATE_STAGE_DATA)
