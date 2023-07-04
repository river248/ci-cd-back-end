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
    PipelineValidation.triggerPipeline,
    RoleMiddleware.isMember,
    PipeLineController.triggerPipeline,
)
router.get('/:repository', AuthMiddleware.isAuth, PipeLineController.getFullPipeline)

export const PipeLineRoute = router
