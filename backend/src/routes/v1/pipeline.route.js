import express from 'express'

import { PipeLineController } from '~/controllers/pipeline.controller'
import { AuthMiddleware } from '~/middlewares/auth.middleware'
import { RoleMiddleware } from '~/middlewares/role.middleware'
import { PipelineValidation } from '~/validations/pipeline.validation'

const router = express.Router()

/**
 * This route is used for getting realtime data from github actions
 */
router.post('/data', PipeLineController.getWorkflowDataFromGithub)

router.post(
    '/trigger-pipeline',
    AuthMiddleware.isAuth,
    PipelineValidation.manuallyTriggerBuild,
    RoleMiddleware.isMember,
    PipeLineController.manuallyTriggerBuild,
)
router.post(
    '/stop-build',
    AuthMiddleware.isAuth,
    PipelineValidation.manuallyStopBuild,
    RoleMiddleware.isMember,
    PipeLineController.manuallyStopBuild,
)
router.get('/queue/:repository', AuthMiddleware.isAuth, PipeLineController.getQueue)
router.get('/:repository', AuthMiddleware.isAuth, PipeLineController.getFullPipeline)

export const PipeLineRoute = router
