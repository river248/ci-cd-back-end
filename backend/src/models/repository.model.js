import Joi from 'joi'

import { getDB } from '~/configs/mongodb'
import InternalServer from '~/errors/internalServer.error'
import { collection } from '~/utils/constants'

const repositoryCollectionSchema = Joi.object({
    name: Joi.string().required().trim(),
    stages: Joi.array().items(Joi.string().valid('build', 'test', 'production').required()).required(),
})

const validateSchema = async (data) => {
    return await repositoryCollectionSchema.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        await getDB().collection(collection.REPOSITORY).insertOne(value)
    } catch (error) {
        throw new InternalServer(error)
    }
}

const update = async (name, data) => {
    try {
        await getDB()
            .collection(collection.REPOSITORY)
            .findOneAndUpdate({ name }, { $set: data }, { returnOriginal: false })
    } catch (error) {
        throw new InternalServer(error)
    }
}

const findAllRepositories = async () => {
    try {
        const res = await getDB().collection(collection.REPOSITORY).find({}).toArray()
        return res
    } catch (error) {
        throw new InternalServer(error)
    }
}

const findRepository = async (name) => {
    try {
        const res = await getDB().collection(collection.REPOSITORY).findOne({ name })
        return res
    } catch (error) {
        throw new InternalServer(error)
    }
}

export const RepositoryModel = {
    createNew,
    update,
    findAllRepositories,
    findRepository,
}
