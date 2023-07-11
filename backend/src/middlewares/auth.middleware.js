import { env } from '~/configs/environment'
import { firebaseHelper } from '~/helpers/firebase.helper'
import { HttpStatusCode } from '~/utils/constants'

const isAuth = async (req, res, next) => {
    const tokenFromClient = req.headers['x-access-token']

    if (tokenFromClient) {
        try {
            const decoded = await firebaseHelper.verifyToken(tokenFromClient)

            req.firebaseDecode = decoded

            next()
        } catch (error) {
            return res.status(HttpStatusCode.UNAUTHORIZED).json({
                error: error.message,
            })
        }
    } else {
        return res.status(HttpStatusCode.FORBIDDEN).json({
            error: 'No token provided.',
        })
    }
}

const isAuthForDeployment = async (req, res, next) => {
    const tokenFromClient = req.headers['Authorization']

    if (tokenFromClient === env.RENDER_BEARER_TOKEN) {
        next()
    } else {
        return res.status(HttpStatusCode.FORBIDDEN).json({
            error: 'No token provided.',
        })
    }
}

export const AuthMiddleware = { isAuth, isAuthForDeployment }
