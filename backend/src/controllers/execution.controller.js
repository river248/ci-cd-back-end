import { ExecutionService } from '~/services/execution.service'
import { HttpStatusCode } from '~/utils/constants'

const findExecutionsByDate = async (req, res) => {
    try {
        const { repository, startDateTime, endDateTime } = req.query
        const result = await ExecutionService.findExecutionsByDate(repository, startDateTime, endDateTime)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(error.statusCode()).json({
            error: error.message,
        })
    }
}

const checkExecutionStatus = async (req, res) => {
    try {
        const { repository, stage, executionId } = req.body
        const result = await ExecutionService.checkExecutionStatus(repository, stage, executionId)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(error.statusCode()).json({
            error: error.message,
        })
    }
}

export const ExecutionController = {
    findExecutionsByDate,
    checkExecutionStatus,
}
