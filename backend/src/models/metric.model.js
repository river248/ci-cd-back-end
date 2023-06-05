import Joi from 'joi'

import { getDB } from '~/configs/mongodb'
import InternalServer from '~/errors/internalServer.error'
import NotFound from '~/errors/notfound.error'
import { collection } from '~/utils/constants'

const metricCollectionSchema = Joi.object({
    executionId: Joi.string().required().trim(),
    repository: Joi.string().required().trim(),
    name: Joi.string().required().trim(),
    stage: Joi.string().required().trim(),
    status: Joi.string().required().trim(),
    startedAt: Joi.date().timestamp().default(null),
    completedAt: Joi.date().timestamp().default(null),
    actual: Joi.number().default(null),
    total: Joi.number().default(null),
})

const validateSchema = async (data) => {
    return await metricCollectionSchema.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        await getDB().collection(collection.METRIC).insertOne(value)
        return value
    } catch (error) {
        throw new InternalServer(error)
    }
}

const update = async ({ repository, name, stage, executionId, data }) => {
    try {
        const res = await getDB()
            .collection(collection.METRIC)
            .findOneAndUpdate({ name, executionId, stage, repository }, { $set: data }, { returnOriginal: false })

        if (res.value) {
            delete res.value._id
            return { ...res.value, ...data }
        }

        throw new NotFound(
            `Not found metric '${name}' with execution '${executionId}' of stage '${name} in repo '${repository}'`,
        )
    } catch (error) {
        throw new InternalServer(error)
    }
}

const findMetric = async ({ name, stage, executionId, repository }) => {
    try {
        const res = await getDB().collection(collection.METRIC).findOne({ name, executionId, stage, repository })
        return res
    } catch (error) {
        throw new InternalServer(error)
    }
}

export const MetricModel = {
    createNew,
    update,
    findMetric,
}
