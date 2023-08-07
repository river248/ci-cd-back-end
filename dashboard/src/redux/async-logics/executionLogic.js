import { fetchExecutionsByDate } from '~/apis/executionAPI'
import { getExecutionsByDate, loading } from '~/redux/actions/executionAction'

export const handleGetExecutionsByDate = (repository, startDateTime, endDateTime) => async (dispatch) => {
    dispatch(loading(true))
    const res = await fetchExecutionsByDate(repository, startDateTime, endDateTime)
    dispatch(getExecutionsByDate(res))
    dispatch(loading(false))
}
