import { env } from '~/configs/environment'
import InternalServer from '~/errors/internalServer.error'
import NotFound from '~/errors/notfound.error'
import { githubAPI, workflowStatus } from '~/utils/constants'
import { MetricService } from './metric.service'
import { StageModel } from '~/models/stage.model'
import { RepositoryModel } from '~/models/repository.model'

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

const summaryJob = (jobs) => {
    let progress = 0
    let successJob = 0
    let compeletedJob = 0
    const totalJob = jobs.length

    for (const job of jobs) {
        const { status, conclusion } = job

        if (status === workflowStatus.COMPLETED) {
            compeletedJob += 1

            if (conclusion === workflowStatus.SUCCESS || conclusion === workflowStatus.SKIPPED) {
                successJob += 1
            }

            progress = Math.round((compeletedJob / totalJob) * 100)
        }
    }

    return { progress, successJob, totalJob }
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
        const { run_id, status, conclusion, head_branch, head_sha, completed_at, name, steps, run_url } = workflow_job
        const { progress, successJob, totalJob } = summaryJob(steps)
        const executionId = run_id.toString()
        const buildStartTime = new Date(workflow_job.created_at)
        const startDateTime = new Date(workflow_job.started_at)
        const stageStatus = conclusion || status

        const workflowRunRes = await _octokit.request(githubAPI.GET_WORKFLOW_RUN_ROUTE, {
            owner: env.GITHUB_OWNER,
            repo: repository.name,
            run_id: executionId,
            headers: githubAPI.HEADERS,
        })
        const version = `0.0.${workflowRunRes.data.run_number}`
        let pipelineData = null
        const isExistedStage = await StageModel.findStageByExecutionId(repository.name, name, executionId)

        if (isExistedStage) {
            pipelineData = await StageModel.update({
                repository: repository.name,
                name,
                executionId,
                data: {
                    status: stageStatus,
                    endDateTime: completed_at ? new Date(completed_at) : completed_at,
                    progress,
                    actual: successJob,
                    total: totalJob,
                },
            })
        } else {
            pipelineData = await StageModel.createNew({
                executionId,
                name,
                repository: repository.name,
                codePipelineBranch: head_branch,
                version,
                commitId: head_sha,
                status: stageStatus,
                buildStartTime,
                startDateTime,
                progress,
                actual: successJob,
                total: totalJob,
            })
        }

        const metrics = await MetricService.addMetric(
            { id: executionId, stage: name, status: stageStatus, repository: repository.name },
            steps,
        )

        pipelineData = { ...pipelineData, metrics }

        return pipelineData
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
                    let stageData = await StageModel.getFullStage(repository, stage)
                    if (!stageData) {
                        return { name: stage, metrics: [] }
                    }

                    stageData.metrics.sort((metricA, metricB) => metricA.rank - metricB.rank)
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
