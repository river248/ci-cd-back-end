import { combineReducers } from 'redux'

import pipelineReducer from './pipelineReducer'
import repositoryReducer from './repositoryReducer'
import executionReducer from './executionReducer'

const rootReducer = combineReducers({
    pipeline: pipelineReducer,
    repository: repositoryReducer,
    execution: executionReducer,
})

export default rootReducer
