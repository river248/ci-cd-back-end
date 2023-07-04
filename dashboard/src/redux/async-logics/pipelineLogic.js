import { fetchFullPipeline } from '~/apis/pipelineAPI'
import { getFullPipeline, loading, updateStageData } from '~/redux/actions/pipelineAction'

export const handleFetchFullPipeline = (repo) => async (dispatch) => {
    dispatch(loading(true))
    const res = await fetchFullPipeline(repo)
    dispatch(getFullPipeline(res))
    dispatch(loading(false))
}

export const handleUpdateStageData = (data) => (dispatch) => {
    dispatch(updateStageData(data))
}
