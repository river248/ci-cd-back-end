import { env } from '~/configs/environment'
import InternalServer from '~/errors/internalServer.error'
import NotFound from '~/errors/notfound.error'
import { githubAPI, workflowStatus } from '~/utils/constants'

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

const summary = (payload) => {
    const { workflow_job, repository } = payload
    const { status, conclusion, head_branch, head_sha, created_at, completed_at, name, steps } = workflow_job
    const { progress, successJob, totalJob } = summaryJob(steps)

    const pipelineData = {
        status: conclusion || status,
        branchName: head_branch,
        startDate: created_at,
        endDate: completed_at,
        commitId: head_sha,
        repository: repository.name,
        stage: name,
        progress,
        successJob,
        totalJob,
    }

    return pipelineData
}

//========================================================================================+
//                                 EXPORT PUBLIC FUNCTIONS                                |
//========================================================================================+

export const PipeLineService = {
    triggerWorkflow,
    summary,
}
