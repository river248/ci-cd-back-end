import express from 'express'

import { PipeLineRoute } from './pipeline.route'
import { RepositoryRoute } from './repository.route'
import { MetricRoute } from './metric.route'

const router = express.Router()

router.get('/status', (_req, res) => res.status(200).json({ status: 'OK' }))
router.use('/pipeline', PipeLineRoute)
router.use('/repository', RepositoryRoute)
router.use('/metric', MetricRoute)

export const apiV1 = router
