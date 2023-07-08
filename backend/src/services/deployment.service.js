import axios from 'axios'

import InternalServer from '~/errors/internalServer.error'
import { asyncTimeout } from '~/utils/helpers'
import { MetricService } from './metric.service'
import { workflowStatus } from '~/utils/constants'
import { env } from '~/configs/environment'

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
                `https://api.render.com/v1/services/${deploymentEnvId}/deploys/${deploymentRes.data.deploy.id}`,
                { headers: { Authorization: env.RENDER_BEARER_TOKEN } },
            )

            const { status } = deployment.data

            if (!status.includes(workflowStatus.IN_PROGRESS)) {
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
