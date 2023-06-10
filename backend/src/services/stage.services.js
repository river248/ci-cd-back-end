import { isEmpty } from 'lodash'

import { MetricService } from './metric.service'
import InternalServer from '~/errors/internalServer.error'
import { StageModel } from '~/models/stage.model'
import { stageMetrics, workflowStatus } from '~/utils/constants'
import NotFound from '~/errors/notfound.error'

const createNew = async (data) => {
    try {
        const result = await StageModel.createNew(data)

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
        if (error instanceof NotFound) {
            throw new NotFound(error.message)
        }

        throw new InternalServer(error.message)
    }
}

const findStages = async (repository, name, condition, limit) => {
    try {
        const stageData = await StageModel.findStages(repository, name, condition, limit)

        return stageData
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

const generateVersion = async (repository, stage) => {
    const DOT = '.'
    const BUILD = 'build'
    const FIRST_VERION = '0.0.1'
    const ELEMENT_TO_GET_VERSION = 2

    try {
        const stages = await findStages(repository, BUILD, {}, 1)

        if (isEmpty(stages)) {
            return FIRST_VERION
        }

        const stageData = stages[0]

        if (stage === BUILD) {
            return `0.0.${stageData.version.split(DOT)[ELEMENT_TO_GET_VERSION] * 1 + 1}`
        }

        return stageData.version
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

const startStage = async (repository, stage, executionId, initialJob) => {
    try {
        const { codePipelineBranch, commitId, buildStartTime, startDateTime, status } = initialJob

        if (status === workflowStatus.QUEUED) {
            const version = await generateVersion(repository, stage)

            const data = {
                executionId,
                name: stage,
                repository,
                codePipelineBranch,
                commitId,
                status: workflowStatus.QUEUED,
                version,
                buildStartTime: new Date(buildStartTime),
            }

            const stageData = await createNew(data)

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

            const stageData = await update(repository, stage, executionId, data)

            const metricData = await Promise.all(
                stageMetrics[stage.toUpperCase()].map(async (item) => {
                    const metricRes = await MetricService.update(
                        repository,
                        stage,
                        executionId,
                        item,
                        {
                            status: workflowStatus.IN_PROGRESS,
                        },
                        'set',
                    )
                    return metricRes
                }),
            )

            return { stageData, metrics: metricData }
        }

        return null
    } catch (error) {
        if (error instanceof NotFound) {
            throw new NotFound(error.message)
        }

        throw new InternalServer(error.message)
    }
}

const finishStage = async (repository, stage, executionId, pipelineStatus, endStartTime) => {
    try {
        let metricData = await MetricService.findMetrics(repository, stage, { executionId })
        const inProgressMetrics = []
        const completedMetrics = []
        let isSuccess = true

        metricData.forEach((metric) => {
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
                            'set',
                        ),
                ),
            )

            isSuccess = workflowStatus.FAILURE
            metricData = [
                ...completedMetrics,
                ...inProgressMetrics.map((inProgressMetric) => ({
                    ...inProgressMetric,
                    status: workflowStatus.FAILURE,
                })),
            ]
        } else {
            metricData.forEach((item) => {
                if (item.status !== workflowStatus.SUCCESS) {
                    isSuccess = false
                    return
                }
            })
        }

        const data = {
            status: isSuccess ? pipelineStatus : workflowStatus.FAILURE,
            endStartTime: new Date(endStartTime),
        }

        const stageData = await StageService.update(repository, stage, executionId, data)

        if (stageData) {
            return { ...stageData, metrics: metricData }
        }

        return null
    } catch (error) {
        if (error instanceof NotFound) {
            throw new NotFound(error.message)
        }

        throw new InternalServer(error.message)
    }
}

//========================================================================================+
//                                 EXPORT PUBLIC FUNCTIONS                                |
//========================================================================================+

export const StageService = {
    createNew,
    update,
    findStages,
    findStageByExecutionId,
    startStage,
    finishStage,
}
