import express from 'express'

import { UserController } from '~/controllers/user.controller'
import { AuthMiddleware } from '~/middlewares/auth.middleware'
import { UserValidation } from '~/validations/user.validation'

const router = express.Router()

router.post(
    '/sign-in-with-github',
    AuthMiddleware.isAuth,
    UserValidation.signInWithGithub,
    UserController.signInWithGithub,
)

export const UserRoute = router
