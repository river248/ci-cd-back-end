import { first, isEmpty, last } from 'lodash'

import { RepositoryService } from './repository.service'
import NotFound from '~/errors/notfound.error'
import InternalServer from '~/errors/internalServer.error'
import { githubAPI, socketEvent, stageName, workflowStatus } from '~/utils/constants'
import { env } from '~/configs/environment'
import { QueueModel } from '~/models/queue.model'
import BadRequest from '~/errors/badRequest.error'
import { StageModel } from '~/models/stage.model'
//========================================================================================+
//                                   PRIVATE FUNCTIONS                                    |
//========================================================================================+

const generateVersion = async (repository) => {
    const DOT = '.'
    const FIRST_VERION = '0.0.1'
    const ELEMENT_TO_GET_VERSION = 2

    try {
        const [stages, waitingBuilds] = await Promise.all([
            StageModel.findStages(repository, { name: stageName.BUILD }, 1),
            QueueModel.findQueue(repository),
        ])

        if (isEmpty(stages) && isEmpty(waitingBuilds)) {
            return FIRST_VERION
        }

        if (!isEmpty(waitingBuilds)) {
            if (waitingBuilds.length >= 10) {
                throw new BadRequest('Queue is full. Please wait for some build is triggered!')
            }

            const latesQueue = last(waitingBuilds)
            const latesVerion = latesQueue.tagName.split('@')[1]

            return `0.0.${latesVerion.split(DOT)[ELEMENT_TO_GET_VERSION] * 1 + 1}`
        }

        const stageData = stages[0]
        return `0.0.${stageData.version.split(DOT)[ELEMENT_TO_GET_VERSION] * 1 + 1}`
    } catch (error) {
        if (error instanceof BadRequest) {
            throw new BadRequest(error.message)
        }
        throw new InternalServer(error.message)
    }
}

const checkBuildable = async (repository) => {
    try {
        const queueOrInProgress = await StageModel.findStages(
            repository,
            {
                name: { $ne: stageName.PRODUCTION },
                status: { $in: [workflowStatus.QUEUED, workflowStatus.IN_PROGRESS] },
            },
            0,
        )

        return isEmpty(queueOrInProgress)
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

const autoTriggerBuild = async (repo, tagName) => {
    try {
        await _octokit.request(githubAPI.WORKFLOW_DISPATCH_ROUTE, {
            owner: env.GITHUB_OWNER,
            repo,
            workflow_id: 'build.yml',
            ref: tagName,
            inputs: {
                name: 'Build',
            },
            headers: githubAPI.HEADERS,
        })
    } catch (error) {
        if (error instanceof NotFound) {
            throw new NotFound(error.message)
        }

        throw new InternalServer(error.message)
    }
}

//========================================================================================+
//                                    PUBLIC FUNCTIONS                                    |
//========================================================================================+

const triggerBuildInQueue = async (repository) => {
    try {
        const buildable = await checkBuildable(repository)

        if (!buildable) {
            return null
        }

        const waitingBuilds = await QueueModel.findQueue(repository)
        const buildableBranch = first(waitingBuilds)

        if (!isEmpty(buildableBranch)) {
            const { tagName } = buildableBranch

            QueueModel.removeFromQueue(repository, tagName)
            autoTriggerBuild(repository, tagName)

            return tagName
        }

        return null
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

const manuallyTriggerBuild = async (repository, branchName, triggerer) => {
    try {
        const [validatedBranch, version] = await Promise.all([
            RepositoryService.validateBranch(repository, branchName),
            generateVersion(repository),
        ])
        const [tagName, buildable] = await Promise.all([
            RepositoryService.createTag(repository, validatedBranch, version),
            checkBuildable(repository),
        ])
        const { user_id, name, picture } = triggerer
        const userData = { userId: user_id, name, avatar: picture }

        if (buildable) {
            await autoTriggerBuild(repository, tagName)
            _io.to(repository).emit(socketEvent.TRIGGER_PIPELINE, userData)

            return 'Trigger build successfully!'
        }

        await QueueModel.pushToQueue({ repository, tagName })
        _io.to(repository).emit(socketEvent.UPDATE_QUEUE, { action: 'push', tagName, userData })

        return 'Push to queue successfully!'
    } catch (error) {
        if (error instanceof NotFound) {
            throw new NotFound(error.message)
        }

        if (error instanceof BadRequest) {
            throw new BadRequest(error.message)
        }

        throw new InternalServer(error.message)
    }
}

const manuallyStopBuild = async (repository, executionId, stopper) => {
    try {
        await _octokit.request(githubAPI.CANCEL_WORKFLOW, {
            owner: env.GITHUB_OWNER,
            repo: repository,
            run_id: executionId,
            headers: githubAPI.HEADERS,
        })

        const { user_id, name, picture } = stopper
        const userData = { userId: user_id, name, avatar: picture }
        _io.to(repository).emit(socketEvent.STOP_BUILD, userData)

        return 'Stop build successfully!'
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

const getQueue = async (repository) => {
    try {
        const [queue, repo] = await Promise.all([
            QueueModel.findQueue(repository),
            RepositoryService.findRepository(repository),
        ])

        if (isEmpty(repo)) {
            throw new NotFound(`Not found repo: ${repository}`)
        }

        return queue
    } catch (error) {
        if (error instanceof NotFound) {
            throw new NotFound(error.message)
        }

        throw new InternalServer(error.message)
    }
}

//========================================================================================+
//                                 EXPORT PUBLIC FUNCTIONS                                |
//========================================================================================+

export const BuildService = {
    manuallyTriggerBuild,
    triggerBuildInQueue,
    getQueue,
    manuallyStopBuild,
}
