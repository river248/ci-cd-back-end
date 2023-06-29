import { combineReducers } from 'redux'

import pipelineReducer from './pipelineReducer'
import repositoryReducer from './repositoryReducer'

const rootReducer = combineReducers({
    pipeline: pipelineReducer,
    repository: repositoryReducer,
})

export default rootReducer
