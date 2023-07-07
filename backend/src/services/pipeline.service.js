import { isEmpty, isNil } from 'lodash'

import InternalServer from '~/errors/internalServer.error'
import NotFound from '~/errors/notfound.error'
import { githubAPI, updateAction, workflowStatus } from '~/utils/constants'
import { MetricService } from './metric.service'
import { RepositoryModel } from '~/models/repository.model'
import { StageService } from './stage.services'
import { toTitleCase } from '~/utils/helpers'
import { RepositoryService } from './repository.service'
import { env } from '~/configs/environment'
//========================================================================================+
//                                   PRIVATE FUNCTIONS                                    |
//========================================================================================+

const handleCompletedJob = async (repository, stage, executionId, metricKey, data) => {
    try {
        const { jobStatus, startDateTime, endDateTime } = data
        const metricName = toTitleCase(metricKey.replaceAll('_', ' '))

        const metrics = await MetricService.findMetrics(repository, stage, { executionId, name: metricName })
        if (isEmpty(metrics)) {
            throw new NotFound(
                `Not found metric ${metricName} with executionId ${executionId} for stage ${stage} at repo ${repository}`,
            )
        }

        const { total, actual } = metrics[0]
        const isFailed = isNil(total) || isNil(actual) || actual !== total || jobStatus === workflowStatus.FAILURE
        const status = isFailed ? workflowStatus.FAILURE : workflowStatus.SUCCESS

        const res = await MetricService.update(
            repository,
            stage,
            executionId,
            metricName,
            { status, startedAt: new Date(startDateTime), completedAt: new Date(endDateTime) },
            updateAction.SET,
        )

        return res
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

const triggerPipeline = async (repo, branchName) => {
    try {
        const [validatedBranch, version] = await Promise.all([
            RepositoryService.validateBranch(repo, branchName),
            generateVersion(repo),
        ])
        const tagName = await RepositoryService.createTag(repo, validatedBranch, version)

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

const generateVersion = async (repository) => {
    const DOT = '.'
    const BUILD = 'build'
    const FIRST_VERION = '0.0.1'
    const ELEMENT_TO_GET_VERSION = 2

    try {
        const stages = await StageService.findStages(repository, BUILD, {}, 1)

        if (isEmpty(stages)) {
            return FIRST_VERION
        }

        const stageData = stages[0]

        return `0.0.${stageData.version.split(DOT)[ELEMENT_TO_GET_VERSION] * 1 + 1}`
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

const handlePipelineData = async (payload) => {
    try {
        const { workflow_job, repository } = payload
        const repo = repository.name
        const executionId = workflow_job.run_id.toString()
        const jobName = workflow_job.name
        const jobStatus = workflow_job.conclusion
        const pipelineStatus = workflow_job.status
        const headBranch = workflow_job.head_branch
        const commitId = workflow_job.head_sha
        const buildStartTime = workflow_job.created_at
        const startDateTime = workflow_job.started_at
        const endDateTime = workflow_job.completed_at
        const stage = workflow_job.workflow_name.toLowerCase()
        const isStartStage = jobName === 'start_stage'
        const isFinishStage = jobName === 'finish_stage'

        /**
         * When stage starts build
         * This block create new stage and metric
         */
        if (isStartStage) {
            const [codePipelineBranch, version] = headBranch.split('@')
            const initialJob = {
                codePipelineBranch,
                commitId,
                buildStartTime,
                startDateTime,
                status: pipelineStatus,
                version,
            }
            const res = await StageService.startStage(repo, stage, executionId, initialJob)

            if (res) {
                return res
            }
        }

        /**
         * When stage finishes build
         * This block create update stage and metric
         */

        if (isFinishStage && pipelineStatus === workflowStatus.COMPLETED) {
            const res = await StageService.finishStage(repo, stage, executionId, jobStatus, endDateTime)

            if (res) {
                return res
            }
        }

        /**
         * When stage is in progress
         */
        if (!isStartStage && !isFinishStage && pipelineStatus === workflowStatus.COMPLETED) {
            await handleCompletedJob(repo, stage, executionId, jobName, { jobStatus, startDateTime, endDateTime })

            const stageData = await StageService.getStageData(repo, stage, executionId, true)

            if (!isEmpty(stageData) && !isNil(stageData)) {
                return stageData
            }
        }

        return null
    } catch (error) {
        if (error instanceof NotFound) {
            throw new NotFound(error.message)
        }

        throw new InternalServer(error.message)
    }
}

const getFullPipeline = async (repository) => {
    try {
        const repo = await RepositoryModel.findRepository(repository)
        if (repo) {
            const pipeline = await Promise.all(
                repo.stages.map(async (stage) => {
                    const stageData = await StageService.getStageData(repository, stage, null, true)
                    if (!stageData) {
                        return { name: stage, metrics: [] }
                    }

                    return stageData
                }),
            )

            return pipeline
        }
        return []
    } catch (error) {
        throw new InternalServer(error.message)
    }
}
//========================================================================================+
//                                 EXPORT PUBLIC FUNCTIONS                                |
//========================================================================================+

export const PipeLineService = {
    triggerPipeline,
    handlePipelineData,
    getFullPipeline,
    generateVersion,
}
