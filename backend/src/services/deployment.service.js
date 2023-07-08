import axios from 'axios'

import InternalServer from '~/errors/internalServer.error'
import { asyncTimeout } from '~/utils/helpers'
import { MetricService } from './metric.service'

const deploymentCheck = async (repostory, stage, executionId, appMetricName, deploymentInfo) => {
    try {
        const { deploymentEnvId, deploymentEnvKey, commitId } = deploymentInfo
        let deploymentMessage = 'Deployment successfully!'
        let actual = 1
        const deploymentRes = await axios.get(
            `https://api.render.com/deploy/${deploymentEnvId}?key=${deploymentEnvKey}&ref=${commitId}`,
        )

        while (true) {
            await asyncTimeout(5000)

            const deployment = await axios.get(
                `https://api.render.com/v1/services/${deploymentEnvId}/deploys/${deploymentRes.deploy.id}`,
            )

            const { status } = deployment

            if (status !== 'build_in_progress') {
                if (status !== 'live') {
                    actual = 0
                    deploymentMessage = 'Deployment failed!'
                }

                await MetricService.handlePushMetric(
                    repostory,
                    stage,
                    executionId,
                    'Deployment Check',
                    appMetricName,
                    `https://dashboard.render.com/web/${deploymentEnvId}/events`,
                    JSON.stringify({ total: 1, actual }),
                )
                break
            }
        }

        return deploymentMessage
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

export const DeploymentService = {
    deploymentCheck,
}
