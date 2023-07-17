import { DeploymentService } from '~/services/deployment.service'
import { HttpStatusCode } from '~/utils/constants'

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

const deployableProduction = async (req, res) => {
    try {
        const { repository, executionId } = req.body

        const result = await DeploymentService.deployableProduction(repository, executionId)
        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(error.statusCode()).json({
            error: error.message,
        })
    }
}

const deployToProd = async (req, res) => {
    try {
        const { repository, version } = req.body

        const result = await DeploymentService.deployToProd(repository, version)
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
    deployableProduction,
}
