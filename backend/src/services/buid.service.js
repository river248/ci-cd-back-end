import { first, isEmpty } from 'lodash'

import NotFound from '~/errors/notfound.error'
import { RepositoryService } from './repository.service'
import InternalServer from '~/errors/internalServer.error'
import { githubAPI, stageName, workflowStatus } from '~/utils/constants'
import { env } from '~/configs/environment'
import { StageService } from './stage.services'
import { QueueModel } from '~/models/queue.model'
//========================================================================================+
//                                   PRIVATE FUNCTIONS                                    |
//========================================================================================+

const generateVersion = async (repository) => {
    const DOT = '.'
    const FIRST_VERION = '0.0.1'
    const ELEMENT_TO_GET_VERSION = 2

    try {
        const stages = await StageService.findStages(repository, stageName.BUILD, {}, 1)

        if (isEmpty(stages)) {
            return FIRST_VERION
        }

        const stageData = stages[0]

        return `0.0.${stageData.version.split(DOT)[ELEMENT_TO_GET_VERSION] * 1 + 1}`
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

const checkBuildable = async (repository, tagName) => {
    try {
        const [queuedBuild, inProgressBuild, queuedTest, inProgressTest] = await Promise.all([
            StageService.findStages(repository, stageName.BUILD, { status: workflowStatus.QUEUED }, 0),
            StageService.findStages(repository, stageName.BUILD, { status: workflowStatus.IN_PROGRESS }, 0),
            StageService.findStages(repository, stageName.TEST, { status: workflowStatus.QUEUED }, 0),
            StageService.findStages(repository, stageName.TEST, { status: workflowStatus.IN_PROGRESS }, 0),
        ])

        if (isEmpty(queuedBuild) && isEmpty(inProgressBuild) && isEmpty(queuedTest) && isEmpty(inProgressTest)) {
            return true
        }

        await QueueModel.pushToQueue(repository, tagName)

        return false
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
        const waitingBuilds = await QueueModel.findQueue(repository)
        const buildableBranch = first(waitingBuilds)

        if (!isEmpty(buildableBranch)) {
            const { tagName } = buildableBranch

            QueueModel.removeFromQueue(repository, tagName)
            autoTriggerBuild(repository, tagName)
        }
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

const manuallyTriggerBuild = async (repository, branchName) => {
    try {
        const [validatedBranch, version] = await Promise.all([
            RepositoryService.validateBranch(repository, branchName),
            generateVersion(repository),
        ])

        const tagName = await RepositoryService.createTag(repository, validatedBranch, version)
        const buildable = await checkBuildable(repository, tagName)

        if (buildable) {
            await autoTriggerBuild(repository, tagName)

            return 'Trigger build successfully!'
        }

        return 'Push to queue successfully!'
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
}
