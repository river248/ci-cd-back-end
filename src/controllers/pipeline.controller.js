import { PipeLineService } from '~/services/pipeline.service'
import { HttpStatusCode } from '~/utils/constants'

const handleDataFromGithubAction = (req, res) => {
    const result = PipeLineService.handleDataFromGithubActions(req.body)

    res.status(HttpStatusCode.OK).json(result)
}

export const PipeLineController = {
    handleDataFromGithubAction,
}
