import { createAction } from '@reduxjs/toolkit'

import { EXECUTION_LOADING, GET_EXECUTIONS_BY_DATE } from '~/redux/types/executionType'

export const loading = createAction(EXECUTION_LOADING)
export const getExecutionsByDate = createAction(GET_EXECUTIONS_BY_DATE)
