import { RepositoryService } from '~/services/repository.service'
import { HttpStatusCode } from '~/utils/constants'

const createNew = async (req, res) => {
    try {
        const result = await RepositoryService.createNew(req.body)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(error.statusCode()).json({
            error: error.message,
        })
    }
}

const update = async (req, res) => {
    try {
        const result = await RepositoryService.update(repository, data)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(error.statusCode()).json({
            error: error.message,
        })
    }
}

const findAllRepositories = async (req, res) => {
    try {
        const result = await RepositoryService.findAllRepositories()
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(error.statusCode()).json({
            error: error.message,
        })
    }
}

export const RepositoryController = {
    createNew,
    update,
    findAllRepositories,
}
