import express from 'express'

import { PipeLineRoute } from './pipeline.route'
import { RepositoryRoute } from './repository.route'
import { MetricRoute } from './metric.route'
import { UserRoute } from './user.route'

const router = express.Router()

router.get('/status', (_req, res) => res.status(200).json({ status: 'OK' }))
router.use('/pipeline', PipeLineRoute)
router.use('/repository', RepositoryRoute)
router.use('/metric', MetricRoute)
router.use('/user', UserRoute)

export const apiV1 = router
