import { getAuth } from 'firebase-admin/auth'

import InternalServer from '~/errors/internalServer.error'

const verifyToken = async (token) => {
    try {
        const decodedToken = await getAuth().verifyIdToken(token)
        return decodedToken
    } catch (error) {
        throw new InternalServer(error.code)
    }
}

export const firebaseHelper = {
    verifyToken,
}
