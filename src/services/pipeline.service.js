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
    handleDataFromGithubActions,
}
