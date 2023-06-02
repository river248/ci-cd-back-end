import { PipeLineService } from '~/services/pipeline.service'
import { HttpStatusCode, socketEvent } from '~/utils/constants'

const triggerWorkflow = async (req, res) => {
    try {
        const { repo, branchName } = req.body
        await PipeLineService.triggerWorkflow(repo, branchName)
        res.status(HttpStatusCode.OK).json({ message: 'Trigger successfully!' })
    } catch (error) {
        res.status(error.statusCode()).json({
            message: error.message,
        })
    }
}

const getWorkflowDataFromGithub = (req, res) => {
    const result = PipeLineService.summary(req.body)
    const { repository } = result

    _io.in(repository).emit(socketEvent.UPDATE_PIPELINE_DATA, result)
    res.status(HttpStatusCode.OK).json(result)
}

export const PipeLineController = {
    triggerWorkflow,
    getWorkflowDataFromGithub,
}
