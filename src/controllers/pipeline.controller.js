import { PipeLineService } from '~/services/pipeline.service'

const handleDataFromGithubAction = (req, res) => {
    const result = PipeLineService.handleDataFromGithubActions(req.body)

    res.status(HttpStatusCode.OK).json(result)
}

export const PipeLineController = {
    handleDataFromGithubAction,
}
