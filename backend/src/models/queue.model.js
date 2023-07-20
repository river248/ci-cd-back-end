import Joi from 'joi'

import { getDB } from '~/configs/mongodb'
import { collection } from '~/utils/constants'

const queueCollectionSchema = Joi.object({
    repository: Joi.string().trim().min(4).max(50).required(),
    tagName: Joi.string().trim().required(),
    createdAt: Joi.date().timestamp().default(Date.now()),
})

const validateSchema = async (data) => {
    return await queueCollectionSchema.validateAsync(data, { abortEarly: false })
}

const pushToQueue = async (data) => {
    try {
        const value = await validateSchema(data)

        const valueValidated = {
            ...value,
            createdAt: Date.now(),
        }

        await getDB().collection(collection.QUEUE).insertOne(valueValidated)

        return { ...value, _id: res.insertedId.toString() }
    } catch (error) {
        throw new Error(error)
    }
}

const findQueue = async (repository) => {
    try {
        const res = await getDB().collection(collection.QUEUE).find({ repository }).sort({ createdAt: 1 }).toArray()

        return res
    } catch (error) {
        throw new Error(error)
    }
}

const removeFromQueue = async (repository, tagName) => {
    try {
        await getDB().collection(collection.QUEUE).deleteOne({ repository, tagName })
    } catch (error) {
        throw new Error(error)
    }
}

export const QueueModel = {
    pushToQueue,
    findQueue,
    removeFromQueue,
}
