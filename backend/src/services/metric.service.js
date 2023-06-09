import axios from 'axios'
import { isNull } from 'lodash'

import InternalServer from '~/errors/internalServer.error'
import NotFound from '~/errors/notfound.error'
import { MetricModel } from '~/models/metric.model'
import { githubAPI, workflowStatus } from '~/utils/constants'
import { toTitleCase } from '~/utils/helpers'

//========================================================================================+
//                                   PRIVATE FUNCTIONS                                    |
//========================================================================================+

const getMetricReport = async (metricKey) => {
    try {
        if (metricKey.includes('code_quality')) {
            const [_metric, appMetricName, projectKey, branchName] = metricKey.split('/')
            const res = await axios.get(`${githubAPI.SONAR_REPORT_URL}?projectKey=${projectKey}&branch=${branchName}`)
            const qualityGates = res.data?.projectStatus.conditions
            const sonarOkQualityGates = qualityGates.filter((qualityGate) => qualityGate.status === 'OK').length
            const sonarErrorQualityGates = qualityGates.filter((qualityGate) => qualityGate.status === 'ERROR').length

            return {
                name: appMetricName,
                actual: sonarOkQualityGates,
                total: sonarErrorQualityGates + sonarOkQualityGates,
            }
        }

        const [_metric, appMetricName] = metricKey.split('/')

        return { name: appMetricName, actual: null, total: null }
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

const pushMetric = async (repository, stage, executionId, metricName, data) => {
    try {
        const { name, actual, total } = data

        const dataToPush = {
            appMetrics: {
                name,
                actual,
                total,
            },
        }

        const metricData = await update(repository, stage, executionId, metricName, dataToPush, 'push')

        return metricData
    } catch (error) {
        if (error instanceof NotFound) {
            throw new NotFound(error.message)
        }

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

const update = async (repository, stage, executionId, name, data, action) => {
    try {
        if (!['set', 'push'].includes(action)) {
            throw new InternalServer('Invalid action. Action must be "set" or "push"')
        }

        const res = await MetricModel.update(repository, stage, executionId, name, data, action)
        return res
    } catch (error) {
        if (error instanceof NotFound) {
            throw new NotFound(error.message)
        }

        throw new InternalServer(error.message)
    }
}

const addMetric = async (repository, stage, executionId, metricKey, steps, data) => {
    try {
        const { status, startedAt, completedAt } = data
        const metricName = toTitleCase(metricKey.replaceAll('_', ' '))

        const appMetricReports = await Promise.all(
            steps.filter((step) => step.name.includes(metricKey)).map(async (step) => await getMetricReport(step.name)),
        )

        let total = null
        let actual = null

        appMetricReports.forEach((appMetricReport) => {
            if (!isNull(appMetricReport.total)) {
                total += appMetricReport.total
            }

            if (!isNull(appMetricReport.actual)) {
                actual += appMetricReport.actual
            }
        })

        await Promise.all(
            appMetricReports.map(
                async (appMetric) =>
                    await pushMetric(repository, stage, executionId, metricName, {
                        name: appMetric.name,
                        actual: appMetric.actual,
                        total: appMetric.total,
                    }),
            ),
        )

        const metricStatus = !total || !actual || actual !== total ? workflowStatus.FAILURE : status

        const metricData = await update(
            repository,
            stage,
            executionId,
            metricName,
            {
                status: metricStatus,
                startedAt: new Date(startedAt),
                completedAt: new Date(completedAt),
            },
            'set',
        )

        return metricData
    } catch (error) {
        if (error instanceof NotFound) {
            throw new NotFound(error.message)
        }

        throw new InternalServer(error.message)
    }
}

const findMetrics = async (repository, stage, conditions) => {
    try {
        const res = await MetricModel.findMetrics(repository, stage, conditions)

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
    pushMetric,
    findMetrics,
}
