import Joi from 'joi'

import { HttpStatusCode } from '~/utils/constants'

const triggerPipeline = async (req, res, next) => {
    const condition = Joi.object({
        repository: Joi.string().trim().min(4).max(50).required(),
        branchName: Joi.string().trim().min(6).max(50).required(),
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

export const PipelineValidation = {
    triggerPipeline,
}
