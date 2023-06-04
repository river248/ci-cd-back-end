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
    GET_BRANCHES_ROUTE: 'GET /repos/{owner}/{repo}/branches',
    WORKFLOW_DISPATCH_ROUTE: 'POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches',
    SONAR_REPORT_URL: 'https://sonarcloud.io/api/qualitygates/project_status',
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
    TEST: [],
}

export const collection = {
    METRIC: 'metrics',
    STAGE: 'stages',
    REPOSITORY: 'repositories',
}

export const socketEvent = {
    USING_PIPELINE: 'using-pipeline',
    UPDATE_PIPELINE_DATA: 'update-pipeline-data',
}

export const clientHost = ['http://localhost:3000']

export const serverHost = 'http://localhost:8080'
