import Joi from 'joi'

import { getDB } from '~/configs/mongodb'
import InternalServer from '~/errors/internalServer.error'
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
    actual: Joi.number().default(null),
    total: Joi.number().default(null),
    progress: Joi.number().min(0).max(100).default(0),
})

const validateSchema = async (data) => {
    return await stageCollectionSchema.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        await getDB().collection(collection.STAGE).insertOne(value)
        return value
    } catch (error) {
        throw new InternalServer(error)
    }
}

const update = async ({ repository, name, executionId, data }) => {
    try {
        const res = await getDB()
            .collection(collection.STAGE)
            .findOneAndUpdate({ repository, name, executionId }, { $set: data }, { returnOriginal: false })

        if (res.value) {
            delete res.value._id
            return { ...res.value, ...data }
        }

        throw new NotFound(`Not found execution '${executionId}' of stage '${name} in repo '${repository}'`)
    } catch (error) {
        throw new InternalServer(error)
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
        throw new InternalServer(error)
    }
}

const findStageByExecutionId = async (repository, name, executionId) => {
    try {
        const res = await getDB().collection(collection.STAGE).findOne({ repository, name, executionId })
        return res
    } catch (error) {
        throw new InternalServer(error)
    }
}

export const StageModel = {
    createNew,
    update,
    getFullStage,
    findStageByExecutionId,
}
