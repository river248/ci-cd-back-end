import { toast } from 'react-toastify'

import axios from './axiosConfig'
import API_ROOT from '~/utils/serverURL'
import { resExceptionMessageHandler } from '~/utils/helper'

export const fetchExecutionsByDate = async (repository, startDateTime, endDateTime) => {
    try {
        const res = await axios.get(
            `${API_ROOT}/v1/execution?repository=${repository}&startDateTime=${startDateTime}&endDateTime=${endDateTime}`,
        )

        return res.data
    } catch (error) {
        toast.error(resExceptionMessageHandler(error))
    }
}
