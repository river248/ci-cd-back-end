import express from 'express'

import { DeploymentController } from '~/controllers/deployment.controller'

const router = express.Router()

router.post('/', DeploymentController.deploymentCheck)

export const DeploymentRoute = router
