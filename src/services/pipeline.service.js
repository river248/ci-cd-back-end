import { Octokit } from 'octokit'

const triggerWorkflow = async () => {
    const octokit = new Octokit({
        auth: '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',
    })

    try {
        const res = await octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
            owner: 'river248',
            repo: 'ci-cd-back-end',
            workflow_id: 'backend.yml',
            ref: 'master',
            inputs: {
                name: 'Backend',
            },
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
            },
        })

        return res
    } catch (error) {
        console.log(error)
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
