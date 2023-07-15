import { toast } from 'react-toastify'

import axios from './axiosConfig'
import API_ROOT from '~/utils/serverURL'
import { resExceptionMessageHandler } from '~/utils/helper'

export const logInWithGithub = async (data) => {
    try {
        const res = await axios.post(`${API_ROOT}/v1/user/sign-in-with-github`, data)
        return res.data
    } catch (error) {
        toast.error(resExceptionMessageHandler(error))
    }
}

export const fetchAllUser = async () => {
    try {
        const res = await axios.get(`${API_ROOT}/v1/user`)
        return res.data
    } catch (error) {
        toast.error(resExceptionMessageHandler(error))
    }
}
