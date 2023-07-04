import Joi from 'joi'

import { getDB } from '~/configs/mongodb'
import { collection } from '~/utils/constants'

const userCollectionSchema = Joi.object({
    _id: Joi.string().required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com'] } })
        .required(),
    name: Joi.string().required().min(3).max(50).trim(),
    avatar: Joi.string()
        .uri({
            scheme: [/https?/],
        })
        .required(),
    role: Joi.string().valid('developer', 'lead-developer', 'admin').default('developer'),
    createdAt: Joi.date().timestamp().default(Date.now()),
    updatedAt: Joi.date().timestamp().default(null),
})

const validateSchema = async (data) => {
    return await userCollectionSchema.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)

        const valueValidated = {
            ...value,
            createdAt: Date.now(),
        }

        await getDB().collection(collection.USER).insertOne(valueValidated)

        return valueValidated
    } catch (error) {
        throw new Error(error)
    }
}

const update = async (id, data) => {
    try {
        const result = await getDB()
            .collection(collection.USER)
            .findOneAndUpdate({ _id: id }, { $set: data }, { returnOriginal: false })
        if (result.value) {
            return { ...result.value, ...data }
        }
        return result.value
    } catch (error) {
        throw new Error(error)
    }
}

const getUser = async (id) => {
    try {
        return await getDB().collection(collection.USER).findOne({ _id: id })
    } catch (error) {
        throw new Error(error)
    }
}

export const UserModel = {
    createNew,
    update,
    getUser,
}
