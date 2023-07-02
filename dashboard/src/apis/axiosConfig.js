import axios from 'axios'

import firebaseAuth from '~/configs/firebase/auth'
import { API_ROOT } from '~/utils/constants'

const axiosInstance = axios.create({
    baseURL: API_ROOT,
})

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await firebaseAuth.currentUser.getIdToken()

        if (token) {
            config.headers['x-access-token'] = token
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

axiosInstance.interceptors.response.use(
    (res) => {
        return res
    },
    (err) => {
        return Promise.reject(err)
    },
)

export default axiosInstance
