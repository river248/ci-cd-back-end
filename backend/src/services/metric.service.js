import InternalServer from '~/errors/internalServer.error'
import NotFound from '~/errors/notfound.error'
import { MetricModel } from '~/models/metric.model'

//========================================================================================+
//                                    PUBLIC FUNCTIONS                                    |
//========================================================================================+

const pushMetric = async (repository, stage, executionId, metricName, appMetricName, data) => {
    try {
        const dataFromJSON = JSON.parse(data)
        const appMetricData = {
            appMetrics: {
                name: appMetricName,
                reportUrl: null,
                actual: null,
                total: null,
            },
        }

        if (metricName === 'Code Quality') {
            const qualityGates = dataFromJSON.projectStatus.conditions
            const sonarOkQualityGates = qualityGates.filter((qualityGate) => qualityGate.status === 'OK').length
            const sonarErrorQualityGates = qualityGates.filter((qualityGate) => qualityGate.status === 'ERROR').length

            appMetricData.appMetrics.actual = sonarOkQualityGates
            appMetricData.appMetrics.total = sonarOkQualityGates + sonarErrorQualityGates
        }

        if (metricName === 'Unit Tests') {
            const { numPassedTests, numTotalTests } = dataFromJSON

            appMetricData.appMetrics.actual = numPassedTests * 1
            appMetricData.appMetrics.total = numTotalTests * 1
        }

        const res = await update(repository, stage, executionId, metricName, appMetricData, 'push')
        return res
    } catch (error) {
        if (error instanceof NotFound) {
            throw new NotFound(error.message)
        }

        throw new InternalServer(error.message)
    }
}

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
    pushMetric,
    findMetrics,
}
