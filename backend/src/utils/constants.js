export const HttpStatusCode = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500,
}

export const githubAPI = {
    HEADERS: {
        'X-GitHub-Api-Version': '2022-11-28',
    },
    GET_COMMIT: 'GET /repos/{owner}/{repo}/commits/{ref}',
    CREATE_TAG: 'POST /repos/{owner}/{repo}/git/refs',
    GET_BRANCHES_ROUTE: 'GET /repos/{owner}/{repo}/branches',
    WORKFLOW_DISPATCH_ROUTE: 'POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches',
    GET_REPOSITORY: 'GET /repos/{owner}/{repo}',
}

export const workflowStatus = {
    QUEUED: 'queued',
    IN_PROGRESS: 'in_progress',
    WAITING: 'waiting',
    COMPLETED: 'completed',
    NEUTRAL: 'neutral',
    SUCCESS: 'success',
    FAILURE: 'failure',
    CANCELLED: 'cancelled',
    ACTION_REQUIRED: 'action_required',
    TIMED_OUT: 'timed_out',
    SKIPPED: 'skipped',
    STALE: 'stale',
}

export const stageMetrics = {
    BUILD: ['Code Quality', 'Unit Tests', 'Unit Test Coverage'],
    TEST: ['Deployment Check'],
    PRODUCTION: ['Deployment Check'],
}

export const updateAction = {
    SET: 'set',
    PUSH: 'push',
}

export const collection = {
    METRIC: 'metrics',
    STAGE: 'stages',
    REPOSITORY: 'repositories',
    USER: 'users',
}

export const socketEvent = {
    USING_PIPELINE: 'using-pipeline',
    UPDATE_PIPELINE_DATA: 'update-pipeline-data',
    TRIGGER_PIPELINE: 'trigger-pipeline',
    DEPLOY_TO_PRODUCTION: 'deploy-to-production',
}

export const clientHost = [
    'http://localhost:3000',
    'https://ci-cd-github-actions.web.app',
    'https://ci-cd-github-actions-test.web.app',
]

export const serverHost = [
    'http://localhost:8080',
    'https://ci-cd-github-actions.onrender.com',
    'https://ci-cd-github-actions-test.onrender.com',
]
