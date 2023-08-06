import { StageService } from '~/services/stage.service'
import { HttpStatusCode } from '~/utils/constants'

const findInstallableProdVersions = async (req, res) => {
    try {
        const { repository } = req.params
        const result = await StageService.findInstallableProdVersions(repository)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(error.statusCode()).json({
            error: error.message,
        })
    }
}

const findStageByRepoAndExecutionId = async (req, res) => {
    try {
        const { name, repository, executionId } = req.query
        const result = await StageService.getStageData(repository, name, executionId, true)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(error.statusCode()).json({
            error: error.message,
        })
    }
}

export const StageController = {
    findInstallableProdVersions,
    findStageByRepoAndExecutionId,
}
