import express from 'express'

import { DeploymentController } from '~/controllers/deployment.controller'
import { AuthMiddleware } from '~/middlewares/auth.middleware'
import { DeploymentValidation } from '~/validations/deployment.validation'

const router = express.Router()

router.post(
    '/production',
    AuthMiddleware.isAuthForDeployment,
    DeploymentValidation.deployToProd,
    DeploymentController.deployToProd,
)
router.post(
    '/deployable-production',
    AuthMiddleware.isAuthForDeployment,
    DeploymentValidation.deployableProduction,
    DeploymentController.deployableProduction,
)
router.post(
    '/',
    AuthMiddleware.isAuthForDeployment,
    DeploymentValidation.deploymentCheck,
    DeploymentController.deploymentCheck,
)

export const DeploymentRoute = router
