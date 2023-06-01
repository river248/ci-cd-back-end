const handleDataFromGithubActions = (payload) => {
    const { repository } = payload
    const checkSuite = payload.check_suite

    const { conclusion, head_branch, created_at, updated_at, head_commit } = checkSuite

    const pipelineData = {
        status: conclusion,
        branch: head_branch,
        startDate: created_at,
        endDate: updated_at,
        commitId: head_commit.id,
        repo: repository.name,
    }

    return pipelineData
}

export const PipeLineService = {
    handleDataFromGithubActions,
}
