import { toast } from 'react-toastify'

import axios from './axiosConfig'
import API_ROOT from '~/utils/serverURL'
import { resExceptionMessageHandler } from '~/utils/helper'

export const fetchInstallableProdVerions = async (repository) => {
    try {
        const res = await axios.get(`${API_ROOT}/v1/stage/${repository}`)
        return res.data
    } catch (error) {
        toast.error(resExceptionMessageHandler(error))
    }
}

export const fetchStageByRepoAndExecutionId = async (repository, name, executionId) => {
    try {
        const res = await axios.get(
            `${API_ROOT}/v1/stage?name=${name}&repository=${repository}&executionId=${executionId}`,
        )
        return res.data
    } catch (error) {
        toast.error(resExceptionMessageHandler(error))
    }
}
