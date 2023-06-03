import axios from 'axios'
import { isEmpty } from 'lodash'

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

const addMetric = async (stage, jobs, executionStatus) => {
    const metrics = jobs.filter((job) => stageMetrics[stage.toUpperCase()].includes(job.name))

    if (executionStatus === workflowStatus.IN_PROGRESS && isEmpty(metrics)) {
        return stageMetrics[stage.toUpperCase()].map((metric) => ({
            name: metric,
            status: workflowStatus.IN_PROGRESS,
            actual: null,
            total: null,
            started_at: null,
            completed_at: null,
        }))
    }

    try {
        const metricData = await Promise.all(
            metrics.map(async (metric) => {
                const { status, name, conclusion } = metric

                let result = {
                    ...metric,
                    actual: null,
                    total: null,
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
