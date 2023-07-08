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
        res.status(HttpStatusCode.OK).json({ message: result })
    } catch (error) {
        res.status(error.statusCode()).json({
            error: error.message,
        })
    }
}

export const DeploymentController = {
    deploymentCheck,
}
