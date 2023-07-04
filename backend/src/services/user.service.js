import { isEmpty, isNil } from 'lodash'

import InternalServer from '~/errors/internalServer.error'
import NotFound from '~/errors/notfound.error'
import { UserModel } from '~/models/user.model'

const signInWithGithub = async (data) => {
    try {
        const user = await UserModel.getUser(data._id)
        let result = user

        if (isEmpty(user) || isNil(user)) {
            result = await UserModel.createNew(data)
        }

        return result
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

const update = async (userId, data) => {
    try {
        const updatedData = {
            ...data,
            updatedAt: Date.now(),
        }

        return await UserModel.update(userId, updatedData)
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

const getUser = async (userId) => {
    try {
        const result = await UserModel.getUser(userId)

        if (isEmpty(result) || isNil(result)) {
            throw new NotFound('Not found user')
        }

        return result
    } catch (error) {
        if (error instanceof NotFound) {
            throw new NotFound(error.message)
        }
        throw new InternalServer(error.message)
    }
}

export const UserService = {
    signInWithGithub,
    update,
    getUser,
}
