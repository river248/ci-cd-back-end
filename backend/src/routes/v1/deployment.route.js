import express from 'express'

import { DeploymentController } from '~/controllers/deployment.controller'
import { AuthMiddleware } from '~/middlewares/auth.middleware'

const router = express.Router()

router.post('/', AuthMiddleware.isAuthForDeployment, DeploymentController.deploymentCheck)

export const DeploymentRoute = router
