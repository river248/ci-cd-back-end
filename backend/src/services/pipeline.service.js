import { env } from '~/configs/environment'

const triggerWorkflow = async (repo, branch) => {
    try {
        await octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
            owner: env.GITHUB_OWNER,
            repo,
            workflow_id: 'backend.yml',
            ref: branch,
            inputs: {
                name: 'Backend',
            },
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
            },
        })
    } catch (error) {
        throw new Error(error)
    }
}

const handleDataFromGithubActions = (payload) => {
    const { workflow_job } = payload
    const { status, conclusion, head_branch, created_at, completed_at } = workflow_job

    const pipelineData = {
        status: conclusion || status,
        branch: head_branch,
        startDate: created_at,
        endDate: completed_at,
    }

    return pipelineData
}

export const PipeLineService = {
    triggerWorkflow,
    handleDataFromGithubActions,
}
