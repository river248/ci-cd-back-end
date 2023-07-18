import { PipeLineService } from '~/services/pipeline.service'
import { HttpStatusCode, socketEvent } from '~/utils/constants'

const triggerPipeline = async (req, res) => {
    try {
        const { repository, branchName } = req.body
        const { user_id } = req.firebaseDecode

        await PipeLineService.triggerPipeline(repository, branchName)

        _io.to(repository).except(user_id).emit(socketEvent.TRIGGER_PIPELINE, user_id)
        res.status(HttpStatusCode.OK).json({ message: 'Trigger successfully!' })
    } catch (error) {
        res.status(error.statusCode()).json({
            error: error.message,
        })
    }
}

const getWorkflowDataFromGithub = async (req, res) => {
    try {
        const result = await PipeLineService.handlePipelineData(req.body)

        if (result) {
            const { repository } = result
            _io.to(repository).emit(socketEvent.UPDATE_PIPELINE_DATA, result)
        }

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(error.statusCode()).json({
            error: error.message,
        })
    }
}

const getFullPipeline = async (req, res) => {
    try {
        const result = await PipeLineService.getFullPipeline(req.params.repository)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(error.statusCode()).json({
            error: error.message,
        })
    }
}

export const PipeLineController = {
    triggerPipeline,
    getWorkflowDataFromGithub,
    getFullPipeline,
}
