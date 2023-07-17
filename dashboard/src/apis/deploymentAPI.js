import { toast } from 'react-toastify'

import axios from './axiosConfig'
import API_ROOT from '~/utils/serverURL'
import { resExceptionMessageHandler } from '~/utils/helper'

export const deployToProd = async (repository, version, approve) => {
    try {
        await axios.post(`${API_ROOT}/v1/deployment/production`, {
            repository,
            version,
            approve,
        })

        if (approve) {
            toast.success('Deploy successfully!')
        } else {
            toast.success('Reject successfully!')
        }
    } catch (error) {
        toast.error(resExceptionMessageHandler(error))
    }
}
