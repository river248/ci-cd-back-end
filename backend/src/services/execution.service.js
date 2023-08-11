import { isEmpty } from 'lodash'

import { MetricService } from './metric.service'
import InternalServer from '~/errors/internalServer.error'
import { githubAPI, updateAction, workflowStatus } from '~/utils/constants'
import { StageModel } from '~/models/stage.model'
import { MetricModel } from '~/models/metric.model'
import { env } from '~/configs/environment'

const stopExecution = async (repository, executionId) => {
    try {
        await _octokit.request(githubAPI.CANCEL_WORKFLOW, {
            owner: env.GITHUB_OWNER,
            repo: repository,
            run_id: executionId,
            headers: githubAPI.HEADERS,
        })
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

const findExecutionsByDate = async (repository, startDateTime, endDateTime) => {
    try {
        const fromDate = new Date(startDateTime)
        let toDate = new Date(endDateTime)

        toDate = toDate.toISOString().split('T')[0]
        toDate = new Date(`${toDate}T23:59:59.999Z`)

        const condition = {
            buildStartTime: { $gte: fromDate },
            endDateTime: { $lte: toDate },
            status: { $nin: [workflowStatus.QUEUED, workflowStatus.IN_PROGRESS] },
        }

        const res = await StageModel.findStages(repository, condition, 0)

        return res
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

const checkExecutionStatus = async (repository, stage, executionId) => {
    try {
        let metrics = await MetricModel.findMetrics(repository, stage, { executionId })
        const inProgressMetrics = []
        const completedMetrics = []
        let isSuccess = true

        metrics.forEach((metric) => {
            if (metric.status === workflowStatus.IN_PROGRESS) {
                inProgressMetrics.push(metric)
            } else {
                completedMetrics.push(metric)
            }
        })

        if (!isEmpty(inProgressMetrics)) {
            await Promise.all(
                inProgressMetrics.map(
                    async (inProgressMetric) =>
                        await MetricService.update(
                            inProgressMetric.repository,
                            inProgressMetric.stage,
                            inProgressMetric.executionId,
                            inProgressMetric.name,
                            { status: workflowStatus.FAILURE },
                            updateAction.SET,
                        ),
                ),
            )

            isSuccess = false
            metrics = [
                ...completedMetrics,
                ...inProgressMetrics.map((inProgressMetric) => ({
                    ...inProgressMetric,
                    status: workflowStatus.FAILURE,
                })),
            ]
        } else {
            const hasError = metrics.find((metric) => metric.status !== workflowStatus.SUCCESS)

            if (hasError) {
                isSuccess = false
            }
        }

        return {
            isSuccess,
            metrics,
        }
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

export const ExecutionService = {
    findExecutionsByDate,
    checkExecutionStatus,
    stopExecution,
}
