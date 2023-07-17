import Joi from 'joi'

import { HttpStatusCode } from '~/utils/constants'

const deploymentCheck = async (req, res, next) => {
    const condition = Joi.object({
        repository: Joi.string().trim().min(4).max(50).required(),
        stage: Joi.string().valid('test', 'production').required(),
        executionId: Joi.string().trim().required(),
        appMetricName: Joi.string().trim().min(4).max(20).required(),
        deploymentInfo: Joi.object({
            deploymentEnvId: Joi.string().trim().required(),
            deploymentEnvKey: Joi.string().trim().required(),
            commitId: Joi.string().trim().required(),
        }),
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

const deployToProd = async (req, res, next) => {
    const condition = Joi.object({
        repository: Joi.string().trim().min(4).max(50).required(),
        version: Joi.string().trim().required(),
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

const deployableProduction = async (req, res, next) => {
    const condition = Joi.object({
        repository: Joi.string().trim().min(4).max(50).required(),
        executionId: Joi.string().trim().required(),
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

export const DeploymentValidation = {
    deploymentCheck,
    deployToProd,
    deployableProduction,
}
