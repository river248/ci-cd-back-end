import axios from 'axios'
import InternalServer from '~/errors/internalServer.error'
import { MetricModel } from '~/models/metric.model'

import { githubAPI, workflowStatus } from '~/utils/constants'
import { toTitleCase } from '~/utils/helpers'

//========================================================================================+
//                                   PRIVATE FUNCTIONS                                    |
//========================================================================================+

const getMetricReport = async (metricKey) => {
    try {
        if (metricKey.includes('code_quality')) {
            const [_metric, projectKey, branchName] = metricKey.split('/')
            const res = await axios.get(`${githubAPI.SONAR_REPORT_URL}?projectKey=${projectKey}&branch=${branchName}`)
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

const createNew = async (data) => {
    try {
        const res = await MetricModel.createNew(data)
        return res
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

const update = async (repository, stage, executionId, name, data) => {
    try {
        const res = await MetricModel.update(repository, stage, executionId, name, data)
        return res
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

const addMetric = async (repository, stage, executionId, metricKey, steps, data) => {
    try {
        const { status, startedAt, completedAt } = data
        const metricName = toTitleCase(metricKey)

        const metricReports = await Promise.all(
            steps.filter((step) => step.name.includes(metricKey)).map(async (step) => getMetricReport(step.name)),
        )

        const totalReport = metricReports.reduce((acc, metricReport) => acc + metricReport.total, 0)
        const actualReport = metricReports.reduce((acc, metricReport) => acc + metricReport.actual, 0)
        const metricStatus = actualReport < totalReport ? workflowStatus.FAILURE : status

        const metricData = await MetricModel.update(repository, stage, executionId, metricName, {
            status: metricStatus,
            startedAt,
            completedAt,
        })

        return metricData
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

const findMetricsByStageAndExecution = async (repository, stage, executionId) => {
    try {
        let res = await MetricModel.findMetricsByStageAndExecution(repository, stage, executionId)
        res = res.sort((metricA, metricB) => metricA.rank - metricB.rank)
        return res
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

//========================================================================================+
//                                 EXPORT PUBLIC FUNCTIONS                                |
//========================================================================================+

export const MetricService = {
    createNew,
    update,
    addMetric,
    findMetricsByStageAndExecution,
}
