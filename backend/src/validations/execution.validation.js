import Joi from 'joi'

import { HttpStatusCode } from '~/utils/constants'

const findExecutionsByDate = async (req, res, next) => {
    const condition = Joi.object({
        repository: Joi.string().trim().min(4).max(50).required(),
        startDateTime: Joi.string().trim().required().length(10),
        endDateTime: Joi.string().trim().required().length(10),
    })

    try {
        const { startDateTime, endDateTime } = await condition.validateAsync(req.query, { abortEarly: false })
        const fromDate = new Date(startDateTime)
        const toDate = new Date(endDateTime)

        if (fromDate.getTime() > toDate.getTime()) {
            throw new Error('startDateTime must be less than or equal endDateTime !')
        }

        next()
    } catch (error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
            error: error.message,
        })
    }
}

export const ExecutionValidation = { findExecutionsByDate }
