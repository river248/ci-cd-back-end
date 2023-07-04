import { UserService } from '~/services/user.service'
import { HttpStatusCode } from '~/utils/constants'

const signInWithGithub = async (req, res) => {
    try {
        const result = await UserService.signInWithGithub(req.body)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(error.statusCode()).json({
            message: error.message,
        })
    }
}

const update = async (req, res) => {
    try {
        const { user_id } = req.firebaseDecode
        const result = await UserService.update(user_id, req.body)

        res.status(HttpStatusCode.CREATED).json(result)
    } catch (error) {
        res.status(error.statusCode()).json({
            message: error.message,
        })
    }
}

export const UserController = {
    signInWithGithub,
    update,
}
