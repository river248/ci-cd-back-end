import Joi from 'joi'

import { HttpStatusCode } from '~/utils/constants'

const createNew = async (req, res, next) => {
    const condition = Joi.object({
        name: Joi.string().trim().min(4).max(50).required(),
        thumbnail: Joi.string()
            .trim()
            .pattern(/^(.+)\/([^/]+)(.jpg|.png|.jpeg)$/i)
            .required(),
        members: Joi.array().items(Joi.string().trim().required()).required(),
        stages: Joi.array().items(Joi.string().valid('build', 'test', 'production').required()).required(),
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

const update = async (req, res, next) => {
    const condition = Joi.object({
        name: Joi.string().min(4).max(50).trim(),
        thumbnail: Joi.string()
            .pattern(/^(.+)\/([^/]+)(.jpg|.png|.jpeg)$/i)
            .trim(),
        members: Joi.array().items(Joi.string().trim()),
        stages: Joi.array().items(Joi.string().valid('build', 'test', 'production')),
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

export const RepositoryValidation = {
    createNew,
    update,
}
