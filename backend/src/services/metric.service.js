import axios from 'axios'
import { isEmpty } from 'lodash'
import InternalServer from '~/errors/internalServer.error'
import NotFound from '~/errors/notfound.error'
import { MetricModel } from '~/models/metric.model'

import { githubAPI, stageMetrics, workflowStatus } from '~/utils/constants'

//========================================================================================+
//                                   PRIVATE FUNCTIONS                                    |
//========================================================================================+

const getMetricReport = async (metricKey) => {
    try {
        if (metricKey === 'CODE_QUALITY') {
            const res = await axios.get(`${githubAPI.SONAR_REPORT_URL}?projectKey=river248_ci-cd-github-actions`)
            const qualityGates = res.data?.projectStatus.conditions
            const sonarOkQualityGates = qualityGates.filter((qualityGate) => qualityGate.status === 'OK').length
            const sonarErrorQualityGates = qualityGates.filter((qualityGate) => qualityGate.status === 'ERROR').length

            return { actual: sonarOkQualityGates, total: sonarErrorQualityGates + sonarOkQualityGates }
        }

        return { actual: null, total: null }
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

//========================================================================================+
//                                    PUBLIC FUNCTIONS                                    |
//========================================================================================+

const addMetric = async (execution, jobs) => {
    const executionId = execution.id
    const executionStage = execution.stage
    const executionRepository = execution.repository
    const executionStatus = execution.status

    const metrics = jobs.filter((job) => stageMetrics[executionStage.toUpperCase()].includes(job.name))

    try {
        if (isEmpty(metrics)) {
            const result = await Promise.all(
                stageMetrics[executionStage.toUpperCase()].map(async (metric) => {
                    let metricData = null
                    const isExistedMetrics = await MetricModel.findMetric({
                        name: metric,
                        executionId,
                        stage: executionStage,
                        repository: executionRepository,
                    })

                    if (isExistedMetrics) {
                        metricData = await MetricModel.update({
                            name: metric,
                            stage: executionStage,
                            repository: executionRepository,
                            executionId,
                            data: {
                                status: executionStatus,
                                startedAt: null,
                                completedAt: null,
                                actual: null,
                                total: null,
                            },
                        })
                    } else {
                        metricData = await MetricModel.createNew({
                            name: metric,
                            stage: executionStage,
                            repository: executionRepository,
                            executionId,
                            status: executionStatus,
                        })
                    }

                    return metricData
                }),
            )

            return result
        }

        const metricData = await Promise.all(
            metrics.map(async (metric) => {
                const { status, name, conclusion, started_at, completed_at } = metric
                let result = null
                let metricStatus =
                    executionStatus === workflowStatus.IN_PROGRESS && status === workflowStatus.QUEUED
                        ? workflowStatus.IN_PROGRESS
                        : status
                let actual = null
                let total = null

                if (status === workflowStatus.COMPLETED) {
                    if (conclusion === workflowStatus.CANCELLED || conclusion === workflowStatus.SKIPPED) {
                        metricStatus = workflowStatus.FAILURE
                    } else {
                        const metricKey = name.toUpperCase().replaceAll(' ', '_')
                        const res = await getMetricReport(metricKey)
                        metricStatus =
                            res.total !== res.actual || !res.actual || !res.total ? workflowStatus.FAILURE : conclusion
                        actual = res.actual
                        total = res.total
                    }
                }

                const isExistedMetrics = await MetricModel.findMetric({
                    name,
                    executionId,
                    stage: executionStage,
                    repository: executionRepository,
                })

                if (isExistedMetrics) {
                    result = await MetricModel.update({
                        repository: executionRepository,
                        name,
                        stage: executionStage,
                        executionId,
                        data: {
                            status: metricStatus,
                            startedAt: started_at,
                            completedAt: completed_at,
                            actual,
                            total,
                        },
                    })
                } else {
                    result = await MetricModel.createNew({
                        name,
                        stage: executionStage,
                        repository: executionRepository,
                        executionId,
                        status: metricStatus,
                        startedAt: started_at,
                        completedAt: completed_at,
                        actual,
                        total,
                    })
                }

                return result
            }),
        )

        return metricData
    } catch (error) {
        if (error instanceof NotFound) {
            throw new InternalServer(error.message)
        }

        throw new InternalServer(error.message)
    }
}

//========================================================================================+
//                                 EXPORT PUBLIC FUNCTIONS                                |
//========================================================================================+

export const MetricService = {
    addMetric,
}
