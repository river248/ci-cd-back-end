import { isEmpty, isNil } from 'lodash'

import { RepositoryService } from '~/services/repository.service'
import { UserService } from '~/services/user.service'
import { HttpStatusCode } from '~/utils/constants'

const isMember = async (req, res, next) => {
    const repository = req.body.repository
    const { user_id } = req.firebaseDecode

    try {
        const [repo, user] = await Promise.all([
            RepositoryService.findRepository(repository),
            UserService.getUser(user_id),
        ])

        if (isNil(user) || isEmpty(user) || user.role === 'developer') {
            return res.status(HttpStatusCode.UNAUTHORIZED).json({
                error: 'Not allowed',
            })
        }

        if (user.role === 'admin') {
            return next()
        }

        if (isNil(repo) || isEmpty(repo)) {
            return res.status(HttpStatusCode.NOT_FOUND).json({
                error: 'Repo has been modified or removed',
            })
        }

        const { members } = repo

        if (members.includes(user_id)) {
            return next()
        }

        return res.status(HttpStatusCode.UNAUTHORIZED).json({
            error: 'Not allowed',
        })
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            error: 'Error when find repo and user',
        })
    }
}

const isAdmin = async (req, res, next) => {
    try {
        const { user_id } = req.firebaseDecode
        const user = await UserService.getUser(user_id)

        if (isNil(user) || isEmpty(user) || user.role !== 'admin') {
            return res.status(HttpStatusCode.UNAUTHORIZED).json({
                error: 'Not allowed',
            })
        }

        next()
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            error: 'Error when find user',
        })
    }
}

export const RoleMiddleware = { isMember, isAdmin }
