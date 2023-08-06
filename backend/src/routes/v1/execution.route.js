import express from 'express'

import { ExecutionController } from '~/controllers/execution.controller'
import { AuthMiddleware } from '~/middlewares/auth.middleware'
import { ExecutionValidation } from '~/validations/execution.validation'

const router = express.Router()

router.get(
    '/',
    AuthMiddleware.isAuth,
    ExecutionValidation.findExecutionsByDate,
    ExecutionController.findExecutionsByDate,
)

export const ExecutionRoute = router
