import express from 'express'
import { MetricController } from '~/controllers/metric.controller'

const router = express.Router()

router.post('/push-metric', MetricController.pushMetric)

export const MetricRoute = router
