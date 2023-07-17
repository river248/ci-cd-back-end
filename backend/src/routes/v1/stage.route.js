import express from 'express'

import { StageController } from '~/controllers/stage.controller'
import { AuthMiddleware } from '~/middlewares/auth.middleware'

const router = express.Router()

router.get('/:repository', AuthMiddleware.isAuth, StageController.findInstallableProdVersions)

export const StageRoute = router
