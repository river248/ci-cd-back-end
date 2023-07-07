import InternalServer from '~/errors/internalServer.error'
import { RepositoryModel } from '~/models/repository.model'
import { githubAPI } from '~/utils/constants'

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

const findRepository = async (name) => {
    try {
        const res = await RepositoryModel.findRepository(name)
        return res
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

const validateBranch = async (repo, branchName) => {
    try {
        const res = await _octokit.request(githubAPI.GET_BRANCHES_ROUTE, {
            owner: env.GITHUB_OWNER,
            repo,
            headers: githubAPI.HEADERS,
        })

        const branches = res.data.map((branch) => branch.name)

        if (!branches.includes(branchName)) {
            throw new NotFound(`Not found branch '${branchName}' in repo '${repo}'`)
        }

        return branchName
    } catch (error) {
        if (error instanceof NotFound) {
            throw new NotFound(error.message)
        }
        throw new InternalServer(error.message)
    }
}

const createTag = async (repo, branchName, tagName) => {
    try {
        const { sha } = await _octokit.request(githubAPI.GET_COMMIT, {
            owner: env.GITHUB_OWNER,
            repo,
            ref: branchName,
            headers: githubAPI.HEADERS,
        })

        await _octokit.request(githubAPI.CREATE_TAG, {
            owner: env.GITHUB_OWNER,
            repo,
            ref: `refs/tags/${tagName}`,
            sha,
            headers: githubAPI.HEADERS,
        })

        return tagName
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

export const RepositoryService = {
    createNew,
    update,
    findAllRepositories,
    findRepository,
    validateBranch,
    createTag,
}
