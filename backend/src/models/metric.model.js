import Joi from 'joi'
import { isEmpty, isNil } from 'lodash'

import { getDB } from '~/configs/mongodb'
import NotFound from '~/errors/notfound.error'
import { collection, updateAction } from '~/utils/constants'

const metricCollectionSchema = Joi.object({
    executionId: Joi.string().trim().required(),
    repository: Joi.string().trim().required(),
    name: Joi.string().trim().required(),
    stage: Joi.string().trim().required(),
    status: Joi.string().trim().required(),
    rank: Joi.number().required().min(1),
    actual: Joi.number().min(0).default(null),
    total: Joi.number().min(0).default(null),
    appMetrics: Joi.array()
        .items(
            Joi.object({
                name: Joi.string().trim(),
                reportUrl: Joi.string().trim(),
                actual: Joi.number().min(0),
                total: Joi.number().min(0),
            }),
        )
        .default([]),
    startedAt: Joi.date().timestamp().allow(null).default(null),
    completedAt: Joi.date().timestamp().allow(null).default(null),
})

const validateSchema = async (data) => {
    return await metricCollectionSchema.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        const res = await getDB().collection(collection.METRIC).insertOne(value)
        return { ...value, _id: res.insertedId.toString() }
    } catch (error) {
        throw new Error(error)
    }
}

const update = async (repository, stage, executionId, name, data, action) => {
    try {
        const key = `$${action}`
        const res = await getDB()
            .collection(collection.METRIC)
            .findOneAndUpdate({ name, executionId, stage, repository }, { [key]: data }, { returnOriginal: false })

        if (!isEmpty(res.value) && !isNil(res.value)) {
            if (action === updateAction.PUSH) {
                res.value.appMetrics.push(data.appMetrics)
                return { ...res.value, _id: res.value._id.toString() }
            }

            return { ...res.value, ...data, _id: res.value._id.toString() }
        }

        throw new NotFound(
            `Not found metric '${name}' with execution '${executionId}' of stage '${name} in repo '${repository}'`,
        )
    } catch (error) {
        if (error instanceof NotFound) {
            throw new NotFound(error.message)
        }

        throw new Error(error)
    }
}

const findMetrics = async (repository, stage, conditions) => {
    try {
        const res = await getDB()
            .collection(collection.METRIC)
            .find({ repository, stage, ...conditions })
            .toArray()
        return res
    } catch (error) {
        throw new Error(error)
    }
}

export const MetricModel = {
    createNew,
    update,
    findMetrics,
}
