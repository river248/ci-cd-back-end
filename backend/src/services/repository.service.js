import InternalServer from '~/errors/internalServer.error'
import { RepositoryModel } from '~/models/repository.model'

const createNew = async (data) => {
    try {
        const res = await RepositoryModel.createNew(data)
        return res
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

const update = async (repository, data) => {
    try {
        const res = await RepositoryModel.update(repository, data)
        return res
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

const findAllRepositories = async () => {
    try {
        const res = await RepositoryModel.findAllRepositories()
        return res
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

export const RepositoryService = {
    createNew,
    update,
    findAllRepositories,
}
