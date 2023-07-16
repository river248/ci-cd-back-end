import { fetchAllRepositories } from '~/apis/repositoryAPI'
import { addNewRepository, getAllRepositories, loading, removeRepository } from '~/redux/actions/repositoryAction'

export const handleFetchAllRepositories = () => async (dispatch) => {
    dispatch(loading(true))
    const res = await fetchAllRepositories()
    dispatch(getAllRepositories(res))
    dispatch(loading(false))
}

export const handleAddNewRepository = (data) => (dispatch) => {
    dispatch(addNewRepository(data))
}

export const handleRemoveRepository = (name) => (dispatch) => {
    dispatch(removeRepository(name))
}
