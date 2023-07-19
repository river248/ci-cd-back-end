import { fetchFullPipeline } from '~/apis/pipelineAPI'
import { fetchStageByRepoAndExecutionId } from '~/apis/stageAPI'
import { getFullPipeline, loading, reLisenSocketEvent, updateStageData } from '~/redux/actions/pipelineAction'
import { processName } from '~/utils/constants'
import { asyncTimeout } from '~/utils/helper'

export const handleFetchFullPipeline = (repo) => async (dispatch) => {
    dispatch(loading(true))
    const res = await fetchFullPipeline(repo)
    dispatch(getFullPipeline(res))
    dispatch(loading(false))
}

export const handleUpdateStageData = (data) => async (dispatch) => {
    const { name, repository, status, executionId } = data

    if (name === 'production' && repository === 'ci-cd-github-actions' && status === processName.IN_PROGRESS) {
        while (true) {
            await asyncTimeout(30000)
            const stageData = await fetchStageByRepoAndExecutionId(repository, name, executionId)
            const stateStatus = stageData.status
            dispatch(updateStageData(stageData))

            if (stateStatus !== processName.IN_PROGRESS) {
                dispatch(reLisenSocketEvent())
                break
            }
        }
    } else {
        dispatch(updateStageData(data))
    }
}
