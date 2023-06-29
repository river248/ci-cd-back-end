import express from 'express'

import { MetricController } from '~/controllers/metric.controller'
import { MetricValidation } from '~/validations/metric.validation'

const router = express.Router()

router.post('/push-metric', MetricValidation.pushMetric, MetricController.pushMetric)

export const MetricRoute = router
