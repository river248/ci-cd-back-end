import { env } from '~/configs/environment'
import InternalServer from '~/errors/internalServer.error'
import NotFound from '~/errors/notfound.error'
import { githubAPI, workflowStatus } from '~/utils/constants'
import { MetricService } from './metric.service'
import { StageModel } from '~/models/stage.model'
import { RepositoryModel } from '~/models/repository.model'
import { StageService } from './stage.services'
//========================================================================================+
//                                   PRIVATE FUNCTIONS                                    |
//========================================================================================+

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
        await validateBranch(repo, branchName)
        await _octokit.request(githubAPI.WORKFLOW_DISPATCH_ROUTE, {
            owner: env.GITHUB_OWNER,
            repo,
            workflow_id: 'backend.yml',
            ref: branchName,
            inputs: {
                name: 'Backend',
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

const handlePipelineData = async (payload) => {
    try {
        const { workflow_job, repository } = payload
        const repo = repository.name
        const executionId = workflow_job.run_id.toString()
        const jobName = workflow_job.name
        const jobStatus = workflow_job.conclusion
        const pipelineStatus = workflow_job.status
        const codePipelineBranch = workflow_job.head_branch
        const commitId = workflow_job.head_sha
        const buildStartTime = workflow_job.created_at
        const startDateTime = workflow_job.started_at
        const endStartTime = workflow_job.completed_at
        const jobSteps = workflow_job.steps
        const stage = workflow_job.workflow_name.toLowerCase()
        const isStartStage = jobName === 'start_stage'
        const isFinishStage = jobName === 'finish_stage'

        /**
         * When stage starts build
         * This block create new stage and metric
         */
        if (isStartStage) {
            const initialJob = {
                codePipelineBranch,
                commitId,
                buildStartTime,
                startDateTime,
                status: pipelineStatus,
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
            const res = await StageService.finishStage(repo, stage, executionId, jobStatus, endStartTime)

            if (res) {
                return res
            }
        }

        /**
         * When stage is in progress
         */
        if (!isStartStage && !isFinishStage && pipelineStatus === workflowStatus.COMPLETED) {
            await MetricService.addMetric(repo, stage, executionId, jobName, jobSteps, {
                status: jobStatus,
                startedAt: startDateTime,
                completedAt: endStartTime,
            })

            const [stageData, metricData] = await Promise.all([
                StageService.findStageByExecutionId(repo, stage, executionId),
                MetricService.findMetricsByStageAndExecution(repo, stage, executionId),
            ])

            if (stageData) {
                return { ...stageData, metrics: metricData }
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
                    const stageData = await StageModel.getFullStage(repository, stage)
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
}
