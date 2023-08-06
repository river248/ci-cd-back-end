import InternalServer from '~/errors/internalServer.error'
import { StageService } from './stage.service'
import { workflowStatus } from '~/utils/constants'

const findExecutionsByDate = async (repository, startDateTime, endDateTime) => {
    try {
        const fromDate = new Date(startDateTime)
        let toDate = new Date(endDateTime)

        toDate = toDate.toISOString().split('T')[0]
        toDate = new Date(`${toDate}T23:59:59.999Z`)

        const condition = {
            buildStartTime: { $gte: fromDate },
            endDateTime: { $lte: toDate },
            status: { $nin: [workflowStatus.QUEUED, workflowStatus.IN_PROGRESS] },
        }

        const res = await StageService.findStages(repository, null, condition, 0)

        return res
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

export const ExecutionService = {
    findExecutionsByDate,
}
