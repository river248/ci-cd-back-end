import express from 'express'

import { DeploymentController } from '~/controllers/deployment.controller'
import { AuthMiddleware } from '~/middlewares/auth.middleware'
import { RoleMiddleware } from '~/middlewares/role.middleware'
import { DeploymentValidation } from '~/validations/deployment.validation'

const router = express.Router()

router.post(
    '/production',
    AuthMiddleware.isAuth,
    DeploymentValidation.deployToProd,
    RoleMiddleware.isMember,
    DeploymentController.deployToProd,
)
router.post(
    '/',
    AuthMiddleware.isAuthForDeployment,
    DeploymentValidation.deploymentCheck,
    DeploymentController.deploymentCheck,
)

export const DeploymentRoute = router
