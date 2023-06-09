import express from 'express'
import { MetricController } from '~/controllers/metric.controller'

const router = express.Router()

router.put('/push-metric', MetricController.pushMetric)

export const RepositoryRoute = router
