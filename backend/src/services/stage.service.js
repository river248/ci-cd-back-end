import { isEmpty, isNil } from 'lodash'

import { MetricService } from './metric.service'
import { BuildService } from './buid.service'
import { ExecutionService } from './execution.service'
import InternalServer from '~/errors/internalServer.error'
import { StageModel } from '~/models/stage.model'
import { socketEvent, stageMetrics, updateAction, workflowStatus, stageName, mainBranch } from '~/utils/constants'
import NotFound from '~/errors/notfound.error'
//========================================================================================+
//                                 PRIVATE FUNCTIONS                                       |
//========================================================================================+
const handleCompletedFinishStage = async ({
    repository,
    stage,
    executionId,
    codePipelineBranch,
    successExecution,
    pipelineStatus,
    endDateTime,
    metrics,
}) => {
    try {
        const data = {
            status: successExecution ? pipelineStatus : workflowStatus.FAILURE,
            requireManualApproval:
                successExecution &&
                pipelineStatus === workflowStatus.SUCCESS &&
                stage === stageName.TEST &&
                codePipelineBranch === mainBranch.MASTER,
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

        if (stage !== stageName.PRODUCTION) {
            BuildService.triggerBuildInQueue(repository).then((tagName) => {
                if (tagName) {
                    _io.to(repository).emit(socketEvent.UPDATE_QUEUE, { action: 'pop', tagName })
                }
            })
        }

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

const finishStage = async ({
    repository,
    stage,
    executionId,
    codePipelineBranch,
    pipelineStatus,
    jobStatus,
    endDateTime,
}) => {
    try {
        const { metrics, isSuccess } = await ExecutionService.checkExecutionStatus(repository, stage, executionId)

        if (pipelineStatus === workflowStatus.QUEUED && codePipelineBranch === mainBranch.MASTER && !isSuccess) {
            await ExecutionService.stopExecution(repository, executionId)
        }

        if (pipelineStatus === workflowStatus.COMPLETED) {
            const res = await handleCompletedFinishStage({
                repository,
                stage,
                executionId,
                codePipelineBranch,
                successExecution: isSuccess,
                pipelineStatus: jobStatus,
                endDateTime,
                metrics,
            })

            return res
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
    try {
        const stages = await StageModel.findStages(
            repository,
            { name: stageName.TEST, requireManualApproval: true, codePipelineBranch: mainBranch.MASTER },
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
    getStageData,
    startStage,
    finishStage,
    findInstallableProdVersions,
}
