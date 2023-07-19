import { isEmpty, isNil } from 'lodash'

import { MetricService } from './metric.service'
import InternalServer from '~/errors/internalServer.error'
import { StageModel } from '~/models/stage.model'
import { socketEvent, stageMetrics, updateAction, workflowStatus, stageName } from '~/utils/constants'
import NotFound from '~/errors/notfound.error'
//========================================================================================+
//                                 PRIVATE FUNCTIONS                                      |
//========================================================================================+
const handleFinishStage = async (repository, stage, executionId) => {
    try {
        let metrics = await MetricService.findMetrics(repository, stage, { executionId })
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
//========================================================================================+
//                                 PUBLIC FUNCTIONS                                       |
//========================================================================================+

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
            ...data,
        }

        if (status) {
            updatedData = { ...updatedData, status }
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

const getStageData = async (repository, name, executionId, hasMetric) => {
    try {
        const stageData = await StageModel.findStage(repository, name, executionId)

        if (isEmpty(stageData) || isNil(stageData)) {
            return null
        }

        if (!hasMetric) {
            delete stageData.metrics
        }

        return stageData
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

const startStage = async (repository, stage, executionId, initialJob) => {
    try {
        const { codePipelineBranch, commitId, buildStartTime, startDateTime, status, version } = initialJob

        if (status === workflowStatus.QUEUED) {
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

                    delete metricRes.repository
                    delete metricRes.stage
                    delete metricRes.executionId

                    return metricRes
                }),
            )

            return { ...stageData, metrics: metricData }
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
                        updateAction.SET,
                    )

                    delete metricRes.repository
                    delete metricRes.stage
                    delete metricRes.executionId

                    return metricRes
                }),
            )

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

const finishStage = async (repository, stage, executionId, codePipelineBranch, pipelineStatus, endDateTime) => {
    try {
        const { metrics, isSuccess } = await handleFinishStage(repository, stage, executionId)

        const data = {
            status: isSuccess ? pipelineStatus : workflowStatus.FAILURE,
            requireManualApproval:
                isSuccess &&
                pipelineStatus === workflowStatus.SUCCESS &&
                stage === stageName.TEST &&
                codePipelineBranch === 'master',
            endDateTime,
        }

        const stageData = await update(repository, stage, executionId, data)

        if (stage === stageName.TEST) {
            const deployableVerions = await findInstallableProdVersions(repository)
            const mapToVersions = deployableVerions.map((deployableVerion) => deployableVerion.version)

            _io.to(repository).emit(socketEvent.UPDATE_DEPLOYABLED_PRODUCTION, mapToVersions)
        }

        metrics.forEach((metric) => {
            delete metric.repository
            delete metric.stage
            delete metric.executionId
        })

        console.log('stage: ', stage, 'stageData: ', stageData)
        if (!isEmpty(stageData) && !isNil(stageData)) {
            return { ...stageData, metrics }
        }

        return null
    } catch (error) {
        if (error instanceof NotFound) {
            throw new NotFound(error.message)
        }

        throw new InternalServer(error.message)
    }
}

const findInstallableProdVersions = async (repository) => {
    const CODE_PIPELINE_BRANCH = 'master'

    try {
        const stages = await findStages(
            repository,
            stageName.TEST,
            { requireManualApproval: true, codePipelineBranch: CODE_PIPELINE_BRANCH },
            0,
        )

        return stages
    } catch (error) {
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
    getStageData,
    startStage,
    finishStage,
    findInstallableProdVersions,
}
