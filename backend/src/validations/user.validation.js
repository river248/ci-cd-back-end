import Joi from 'joi'
import { HttpStatusCode } from '~/utils/constants'

const signInWithGithub = async (req, res, next) => {
    const condition = Joi.object({
        _id: Joi.string().trim().required(),
        name: Joi.string().trim().required().min(3).max(50),
        email: Joi.string()
            .trim()
            .email({ minDomainSegments: 2, tlds: { allow: ['com'] } })
            .required(),
        avatar: Joi.string()
            .trim()
            .uri({
                scheme: [/https?/],
            })
            .required(),
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
        userId: Joi.string().trim().required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }),
        name: Joi.string().trim().min(3).max(50),
        avatar: Joi.string().uri({
            scheme: [/https?/],
        }),
        role: Joi.string().valid('developer', 'lead-developer', 'admin'),
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

export const UserValidation = {
    signInWithGithub,
    update,
}
