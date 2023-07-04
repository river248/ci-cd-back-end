import Joi from 'joi'

import { HttpStatusCode } from '~/utils/constants'

const pushMetric = async (req, res, next) => {
    const condition = Joi.object({
        repository: Joi.string().trim().min(4).max(50).required(),
        stage: Joi.string().trim().min(4).max(10).required(),
        executionId: Joi.string().trim().required(),
        metricName: Joi.string().trim().min(4).max(20).required(),
        appMetricName: Joi.string().trim().min(4).max(20).required(),
        reportUrl: Joi.string().default(null).trim(),
        data: Joi.string().trim().required(),
    })
    try {
        await condition.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
            error: error.message,
        })
    }
}

export const MetricValidation = {
    pushMetric,
}
