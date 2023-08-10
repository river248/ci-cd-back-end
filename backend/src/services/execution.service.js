import InternalServer from '~/errors/internalServer.error'
import { workflowStatus } from '~/utils/constants'
import { StageModel } from '~/models/stage.model'

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

        const res = await StageModel.findStages(repository, condition, 0)

        return res
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

export const ExecutionService = {
    findExecutionsByDate,
}
