import express from 'express'

import { PipeLineRoute } from './pipeline.route'
import { RepositoryRoute } from './repository.route'
import { MetricController } from '~/controllers/metric.controller'

const router = express.Router()

router.get('/status', (_req, res) => res.status(200).json({ status: 'OK' }))
router.use('/pipeline', PipeLineRoute)
router.use('/repository', RepositoryRoute)
router.use('/metric', MetricController)

export const apiV1 = router
