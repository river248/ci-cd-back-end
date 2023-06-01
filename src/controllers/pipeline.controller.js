import { PipeLineService } from '~/services/pipeline.service'
import { HttpStatusCode } from '~/utils/constants'

const triggerWorkflow = async (req, res) => {
    try {
        const result = await PipeLineService.triggerWorkflow()
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER).json({
            message: error.message,
        })
    }
}

const handleDataFromGithubAction = (req, res) => {
    const result = PipeLineService.handleDataFromGithubActions(req.body)

    console.log(result)
    res.status(HttpStatusCode.OK).json(result)
}

export const PipeLineController = {
    triggerWorkflow,
    handleDataFromGithubAction,
}
