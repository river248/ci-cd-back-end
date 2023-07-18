import { DeploymentService } from '~/services/deployment.service'
import { HttpStatusCode, socketEvent } from '~/utils/constants'

const deploymentCheck = async (req, res) => {
    try {
        const { repository, stage, executionId, appMetricName, deploymentInfo } = req.body

        const result = await DeploymentService.deploymentCheck(
            repository,
            stage,
            executionId,
            appMetricName,
            deploymentInfo,
        )
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(error.statusCode()).json({
            error: error.message,
        })
    }
}

const deployToProd = async (req, res) => {
    try {
        const { repository, version, approve } = req.body
        const { user_id, name, picture } = req.firebaseDecode
        const userData = { userId: user_id, name, avatar: picture }

        const result = await DeploymentService.deployToProd(repository, version, approve)

        _io.to(repository).emit(socketEvent.DEPLOY_TO_PRODUCTION, {
            userData,
            deployableVerions: result,
            deployedVerion: version,
            approve,
        })
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(error.statusCode()).json({
            error: error.message,
        })
    }
}

export const DeploymentController = {
    deploymentCheck,
    deployToProd,
}
