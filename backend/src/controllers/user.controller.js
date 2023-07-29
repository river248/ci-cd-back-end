import { UserService } from '~/services/user.service'
import { HttpStatusCode } from '~/utils/constants'

const signInWithGithub = async (req, res) => {
    try {
        const result = await UserService.signInWithGithub(req.body)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(error.statusCode()).json({
            error: error.message,
        })
    }
}

const update = async (req, res) => {
    try {
        const result = await UserService.update(req.body)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(error.statusCode()).json({
            error: error.message,
        })
    }
}

const getAllUsers = async (_req, res) => {
    try {
        const result = await UserService.getAllUsers()

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(error.statusCode()).json({
            error: error.message,
        })
    }
}

export const UserController = {
    signInWithGithub,
    update,
    getAllUsers,
}
