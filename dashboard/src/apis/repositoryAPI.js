import { toast } from 'react-toastify'

import axios from './axiosConfig'
import API_ROOT from '~/utils/serverURL'
import { resExceptionMessageHandler } from '~/utils/helper'

export const createNewRepo = async (name, image, members) => {
    try {
        const thumbnail = await uploadImage(image, 'repository')

        const res = await axios.post(`${API_ROOT}/v1/reposity`, {
            name,
            members,
            thumbnail,
            stages: ['build', 'test', 'production'],
        })

        return res.data
    } catch (error) {
        toast.error(resExceptionMessageHandler(error))
    }
}

export const fetchAllRepositories = async () => {
    try {
        const res = await axios.get(`${API_ROOT}/v1/repository`)
        return res.data
    } catch (error) {
        toast.error(resExceptionMessageHandler(error))
    }
}
