import { PipeLineService } from '~/services/pipeline.service'
import { HttpStatusCode, socketEvent } from '~/utils/constants'

const triggerWorkflow = async (req, res) => {
    try {
        const { repo, branch } = req.body
        await PipeLineService.triggerWorkflow(repo, branch)
        res.status(HttpStatusCode.OK).json({ message: 'Trigger successfully!' })
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            message: error.message,
        })
    }
}

const handleDataFromGithubAction = (req, res) => {
    const result = PipeLineService.handleDataFromGithubActions(req.body)
    const { repository } = result

    _io.to(repository).emit(socketEvent.UPDATE_PIPELINE_DATA, result)
    res.status(HttpStatusCode.OK).json(result)
}

export const PipeLineController = {
    triggerWorkflow,
    handleDataFromGithubAction,
}
