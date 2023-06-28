import { MetricService } from '~/services/metric.service'
import { HttpStatusCode, socketEvent } from '~/utils/constants'

const pushMetric = async (req, res) => {
    try {
        const { repository, stage, executionId, metricName, appMetricName, reportUrl, data } = req.body
        const result = await MetricService.handlePushMetric(
            repository,
            stage,
            executionId,
            metricName,
            appMetricName,
            reportUrl,
            data,
        )

        if (result) {
            _io.in(repository).emit(socketEvent.UPDATE_PIPELINE_DATA, result)
        }

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
