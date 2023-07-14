import { fetchAllRepositories } from '~/apis/repositoryAPI'
import { addNewRepository, getAllRepositories, loading } from '~/redux/actions/repositoryAction'

export const handleFetchAllRepositories = () => async (dispatch) => {
    dispatch(loading(true))
    const res = await fetchAllRepositories()
    dispatch(getAllRepositories(res))
    dispatch(loading(false))
}

export const handleAddNewRepository = (data) => async (dispatch) => {
    dispatch(addNewRepository(data))
}
