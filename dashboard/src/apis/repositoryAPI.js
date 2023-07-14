import { toast } from 'react-toastify'
import { isEmpty } from 'lodash'

import axios from './axiosConfig'
import API_ROOT from '~/utils/serverURL'
import { resExceptionMessageHandler } from '~/utils/helper'
import { removeImage, uploadImage } from '~/utils/firebaseHelper'

export const createNewRepo = async (name, image, members) => {
    let thumbnail = ''

    try {
        thumbnail = await uploadImage(image, 'repository')

        const res = await axios.post(`${API_ROOT}/v1/repository`, {
            name,
            members,
            thumbnail,
            stages: ['build', 'test', 'production'],
        })

        toast.success('Create a new repository successfully!')
        return res.data
    } catch (error) {
        if (!isEmpty(thumbnail)) {
            removeImage(thumbnail)
        }
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
