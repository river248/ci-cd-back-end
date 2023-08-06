import express from 'express'

import { PipeLineRoute } from './pipeline.route'
import { RepositoryRoute } from './repository.route'
import { MetricRoute } from './metric.route'
import { UserRoute } from './user.route'
import { DeploymentRoute } from './deployment.route'
import { StageRoute } from './stage.route'
import { ExecutionRoute } from './execution.route'

const router = express.Router()

router.get('/status', (_req, res) => res.status(200).json({ status: 'OK' }))
router.use('/pipeline', PipeLineRoute)
router.use('/repository', RepositoryRoute)
router.use('/metric', MetricRoute)
router.use('/user', UserRoute)
router.use('/deployment', DeploymentRoute)
router.use('/stage', StageRoute)
router.use('/execution', ExecutionRoute)

export const apiV1 = router
