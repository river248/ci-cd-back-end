import InternalServer from '~/errors/internalServer.error'
import { StageModel } from '~/models/stage.model'
import { githubAPI, stageMetrics, workflowStatus } from '~/utils/constants'
import { MetricService } from './metric.service'

const createNew = async (repository, name, executionId, data) => {
    try {
        const { codePipelineBranch, commitId, status, buildStartTime } = data

        const workflowRunRes = await _octokit.request(githubAPI.GET_WORKFLOW_RUN_ROUTE, {
            owner: env.GITHUB_OWNER,
            repo: repository,
            run_id: executionId,
            headers: githubAPI.HEADERS,
        })
        const version = `0.0.${workflowRunRes.data.run_number}`
        const createdData = {
            executionId,
            name,
            repository,
            codePipelineBranch,
            commitId,
            status,
            version,
            buildStartTime: new Date(buildStartTime),
        }
        const result = await StageModel.createNew(createdData)

        return result
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

const update = async (repository, name, executionId, data) => {
    try {
        const { status, startDateTime, endDateTime } = data

        let updatedData = {
            status,
        }

        if (startDateTime) {
            updatedData = { ...updatedData, startDateTime: new Date(startDateTime) }
        }

        if (endDateTime) {
            updatedData = { ...updatedData, endDateTime: new Date(endDateTime) }
        }

        const result = await StageModel.update(repository, name, executionId, updatedData)

        return result
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

const findStageByExecutionId = async (repository, name, executionId) => {
    try {
        const stageData = await StageModel.findStageByExecutionId(repository, name, executionId)

        return stageData
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

const startStage = async (repository, stage, executionId, initialJob) => {
    try {
        const { codePipelineBranch, commitId, buildStartTime, startDateTime, status } = initialJob

        if (status === workflowStatus.QUEUED) {
            const data = {
                codePipelineBranch,
                commitId,
                status: workflowStatus.QUEUED,
                buildStartTime,
            }

            const stageData = await StageService.createNew(repository, stage, executionId, data)

            const metricData = await Promise.all(
                stageMetrics[stage.toUpperCase()].map(async (item, index) => {
                    const metricRes = await MetricService.createNew({
                        executionId,
                        repository,
                        name: item,
                        stage,
                        status: workflowStatus.QUEUED,
                        rank: index * 1 + 1,
                    })
                    return metricRes
                }),
            )

            return { stageData, metrics: metricData }
        }

        if (status === workflowStatus.COMPLETED) {
            const data = {
                status: workflowStatus.IN_PROGRESS,
                startDateTime,
            }

            const stageData = await StageService.update(repository, stage, executionId, data)

            const metricData = await Promise.all(
                stageMetrics[stage.toUpperCase()].map(async (item) => {
                    const metricRes = await MetricService.update(repository, stage, executionId, item, {
                        status: workflowStatus.IN_PROGRESS,
                    })
                    return metricRes
                }),
            )

            return { stageData, metrics: metricData }
        }

        return null
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

const finishStage = async (repository, stage, executionId, endStartTime) => {
    try {
        const metricData = await MetricService.findMetricsByStageAndExecution(repository, stage, executionId)
        let isSuccess = true

        metricData.forEach((item) => {
            if (item.status !== workflowStatus.SUCCESS) {
                isSuccess = false
                return
            }
        })

        const data = {
            status: isSuccess ? workflowStatus.SUCCESS : workflowStatus.FAILURE,
            endStartTime,
        }
        const stageData = await StageService.update(repository, stage, executionId, data)

        if (stageData) {
            return { ...stageData, metrics: metricData ?? [] }
        }

        return null
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

export const StageService = {
    createNew,
    update,
    findStageByExecutionId,
    startStage,
    finishStage,
}
