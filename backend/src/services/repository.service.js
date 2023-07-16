import { isEmpty } from 'lodash'

import { env } from '~/configs/environment'
import BadRequest from '~/errors/badRequest.error'
import InternalServer from '~/errors/internalServer.error'
import NotFound from '~/errors/notfound.error'
import { RepositoryModel } from '~/models/repository.model'
import { githubAPI } from '~/utils/constants'

const createNew = async (data) => {
    try {
        const { name } = data
        const [repoData] = await Promise.all([
            findRepository(name),
            _octokit.request(githubAPI.GET_REPOSITORY, {
                owner: env.GITHUB_OWNER,
                repo: name,
                headers: githubAPI.HEADERS,
            }),
        ])

        if (!isEmpty(repoData)) {
            throw new BadRequest('This repo name is existed!')
        }

        const res = await RepositoryModel.createNew(data)

        return res
    } catch (error) {
        if (error instanceof BadRequest) {
            throw new BadRequest(error.message)
        }
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
        const res = await _octokit.request(githubAPI.GET_COMMIT, {
            owner: env.GITHUB_OWNER,
            repo,
            ref: branchName,
            headers: githubAPI.HEADERS,
        })

        const tag = `${branchName}@${tagName}`

        await _octokit.request(githubAPI.CREATE_TAG, {
            owner: env.GITHUB_OWNER,
            repo,
            ref: `refs/tags/${tag}`,
            sha: res.data.sha,
            headers: githubAPI.HEADERS,
        })

        return tag
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

const removeRepository = async (name) => {
    try {
        const res = await RepositoryModel.removeRepository(name)
        const { deletedCount } = res

        if (deletedCount === 0) {
            throw new NotFound(`Not found repository: ${name}`)
        }

        return res
    } catch (error) {
        if (error instanceof NotFound) {
            throw new NotFound(error.message)
        }

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
    removeRepository,
}
