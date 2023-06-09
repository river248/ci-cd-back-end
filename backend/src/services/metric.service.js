import InternalServer from '~/errors/internalServer.error'
import NotFound from '~/errors/notfound.error'
import { MetricModel } from '~/models/metric.model'
import { toTitleCase } from '~/utils/helpers'

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

const addMetric = async (repository, stage, executionId, metricKey, data) => {
    try {
        const { status, startedAt, completedAt } = data
        const metricName = toTitleCase(metricKey.replaceAll('_', ' '))

        const metricData = await update(
            repository,
            stage,
            executionId,
            metricName,
            {
                status,
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
