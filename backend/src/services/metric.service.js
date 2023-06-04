import axios from 'axios'
import { isEmpty } from 'lodash'
import InternalServer from '~/errors/internalServer.error'
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
        if (executionStatus === workflowStatus.IN_PROGRESS && isEmpty(metrics)) {
            const result = await Promise.all(
                stageMetrics[executionStage.toUpperCase()].map(async (metric) => {
                    await MetricModel.createNew({
                        name: metric,
                        stage: executionStage,
                        repository: executionRepository,
                        executionId,
                        status: workflowStatus.IN_PROGRESS,
                    })

                    return {
                        name: metric,
                        status: workflowStatus.IN_PROGRESS,
                        actual: null,
                        total: null,
                        startedAt: null,
                        completedAt: null,
                    }
                }),
            )

            return result
        }

        const metricData = await Promise.all(
            metrics.map(async (metric) => {
                const { status, name, conclusion, started_at, completed_at } = metric

                let result = {
                    ...metric,
                    actual: null,
                    total: null,
                    startedAt: started_at,
                    completedAt: completed_at,
                }

                if (status === workflowStatus.COMPLETED) {
                    if (conclusion === workflowStatus.CANCELLED || conclusion === workflowStatus.SKIPPED) {
                        result = { ...result, status: workflowStatus.FAILURE }
                    } else {
                        const metricKey = name.toUpperCase().replaceAll(' ', '_')
                        const res = await getMetricReport(metricKey)
                        result = { ...result, ...res, status: conclusion }
                    }
                }
                await MetricModel.update({
                    repository: executionRepository,
                    name,
                    stage: executionStage,
                    executionId,
                    data: {
                        status: result.status,
                        startedAt: result.startedAt,
                        completedAt: result.completedAt,
                        actual: result.actual,
                        total: result.total,
                    },
                })

                delete result.conclusion
                delete result.number

                return result
            }),
        )

        return metricData
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

//========================================================================================+
//                                 EXPORT PUBLIC FUNCTIONS                                |
//========================================================================================+

export const MetricService = {
    addMetric,
}
