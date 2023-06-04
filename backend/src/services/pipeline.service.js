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

const triggerWorkflow = async (repo, branchName) => {
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

        if (status === workflowStatus.QUEUED) {
            await StageModel.createNew({
                executionId,
                name,
                repository: repository.name,
                codePipelineBranch: head_branch,
                commitId: head_sha,
                status,
                buildStartTime,
                startDateTime,
                progress,
                actual: successJob,
                total: totalJob,
            })
        } else {
            await StageModel.update(name, run_id.toString, {
                status,
                endDateTime: completed_at ? new Date(completed_at) : completed_at,
                progress,
                actual: successJob,
                total: totalJob,
            })
        }

        const metrics = await MetricService.addMetric(
            { id: executionId, stage: name, status, repository: repository.name },
            steps,
        )

        const pipelineData = {
            executionId,
            status: conclusion || status,
            codePipelineBranch: head_branch,
            buildStartTime,
            startDateTime,
            endDateTime: completed_at ? new Date(completed_at) : completed_at,
            commitId: head_sha,
            repository: repository.name,
            stage: name,
            progress,
            successJob,
            totalJob,
            metrics,
            pipelineUrl: run_url,
        }

        return pipelineData
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

const getFullPipeline = async (repository) => {
    try {
        const repo = await RepositoryModel.findRepository(repository)
        if (repo) {
            const pipeline = await Promise.all(
                repo.stages.map(async (stage) => await StageModel.getFullStage(repository, stage)),
            )

            return pipeline
        }
        return []
    } catch (error) {}
}
//========================================================================================+
//                                 EXPORT PUBLIC FUNCTIONS                                |
//========================================================================================+

export const PipeLineService = {
    triggerWorkflow,
    handlePipelineData,
    getFullPipeline,
}
