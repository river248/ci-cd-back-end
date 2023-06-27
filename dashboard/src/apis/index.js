import { toast } from 'react-toastify'

import axios from './axiosConfig'
import { API_ROOT } from '~/utils/constants'
import { resExceptionMessageHandler } from '~/utils/helper'

export const fetchAllRepositories = async () => {
    try {
        const res = await axios.get(`${API_ROOT}/v1/repository`)
        return res.data
    } catch (error) {
        toast.error(resExceptionMessageHandler(error))
    }
}

export const fetchFullPipeline = async (repository) => {
    try {
        const res = await axios.get(`${API_ROOT}/v1/pipeline/${repository}`)
        return res.data
    } catch (error) {
        toast.error(resExceptionMessageHandler(error))
    }
}
