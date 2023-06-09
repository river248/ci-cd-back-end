import Joi from 'joi'

import { getDB } from '~/configs/mongodb'
import NotFound from '~/errors/notfound.error'
import { collection } from '~/utils/constants'

const stageCollectionSchema = Joi.object({
    executionId: Joi.string().required().trim(),
    name: Joi.string().required().trim(),
    repository: Joi.string().required().trim(),
    codePipelineBranch: Joi.string().required().trim(),
    commitId: Joi.string().required().trim(),
    status: Joi.string().required().trim(),
    version: Joi.string().required().trim(),
    deploymentId: Joi.string().default(null),
    buildStartTime: Joi.date().timestamp().default(null),
    startDateTime: Joi.date().timestamp().default(null),
    endDateTime: Joi.date().timestamp().default(null),
})

const validateSchema = async (data) => {
    return await stageCollectionSchema.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        const res = await getDB().collection(collection.STAGE).insertOne(value)
        return { ...value, _id: res.insertedId.toString() }
    } catch (error) {
        throw new Error(error)
    }
}

const update = async (repository, name, executionId, data) => {
    try {
        const res = await getDB()
            .collection(collection.STAGE)
            .findOneAndUpdate({ repository, name, executionId }, { $set: data }, { returnOriginal: false })

        if (res.value) {
            return { ...res.value, ...data, _id: res.value._id.toString() }
        }

        throw new NotFound(`Not found execution '${executionId}' of stage '${name} in repo '${repository}'`)
    } catch (error) {
        if (error instanceof NotFound) {
            throw new NotFound(error.message)
        }

        throw new Error(error)
    }
}

const getFullStage = async (repository, name) => {
    try {
        const res = await getDB()
            .collection(collection.STAGE)
            .aggregate([
                { $match: { name, repository } },
                { $sort: { buildStartTime: -1 } },
                { $limit: 1 },
                {
                    $lookup: {
                        from: collection.METRIC,
                        let: { executionStageId: '$executionId' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$repository', repository] },
                                            { $eq: ['$stage', name] },
                                            { $eq: ['$executionId', '$$executionStageId'] },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: 'metrics',
                    },
                },
            ])
            .toArray()
        return res[0]
    } catch (error) {
        throw new Error(error)
    }
}

const findStageByExecutionId = async (repository, name, executionId) => {
    try {
        const res = await getDB().collection(collection.STAGE).findOne({ repository, name, executionId })
        return res
    } catch (error) {
        throw new Error(error)
    }
}

/**
 *
 * @param {string} repository
 * @param {string} name
 * @param {object} condition
 */
const findStages = async (repository, name, condition, limit) => {
    try {
        const res = await getDB()
            .collection(collection.STAGE)
            .find({ repository, name, ...condition })
            .sort({ buildStartTime: -1 })
            .limit(limit)
            .toArray()
        return res
    } catch (error) {
        throw new Error(error)
    }
}

export const StageModel = {
    createNew,
    update,
    getFullStage,
    findStages,
    findStageByExecutionId,
}
