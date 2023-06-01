import { Octokit } from 'octokit'

const triggerWorkflow = async () => {
    const octokit = new Octokit({
        auth: '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',
    })

    try {
        const res = await octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
            owner: 'river248',
            repo: 'ci-cd-back-end',
            workflow_id: 'Github River Pipeline',
            ref: 'master',
            inputs: {
                name: 'Mona the Octocat',
                home: 'San Francisco, CA',
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
