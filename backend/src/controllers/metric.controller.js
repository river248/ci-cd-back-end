import { MetricService } from '~/services/metric.service'
import { HttpStatusCode } from '~/utils/constants'

const pushMetric = async (req, res) => {
    try {
        const { repository, stage, executionId, metricName, appMetricName, data } = req.body
        const result = await MetricService.pushMetric(repository, stage, executionId, metricName, appMetricName, data)
        res.status(HttpStatusCode.OK).json({ result })
    } catch (error) {
        res.status(error.statusCode()).json({
            message: error.message,
        })
    }
}

export const MetricController = {
    pushMetric,
}
