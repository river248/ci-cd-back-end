import express from 'express'

import { StageController } from '~/controllers/stage.controller'
import { AuthMiddleware } from '~/middlewares/auth.middleware'
import { StageValidation } from '~/validations/stage.validation'

const router = express.Router()

router.get(
    '/executions',
    AuthMiddleware.isAuth,
    StageValidation.findExecutionsByDate,
    StageController.findExecutionsByDate,
)
router.get('/:repository', AuthMiddleware.isAuth, StageController.findInstallableProdVersions)
router.get('/', AuthMiddleware.isAuth, StageController.findStageByRepoAndExecutionId)

export const StageRoute = router
