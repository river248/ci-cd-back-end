import { combineReducers } from 'redux'

import pipelineReducer from './pipelineReducer'

const rootReducer = combineReducers({
    pipeline: pipelineReducer,
})

export default rootReducer
