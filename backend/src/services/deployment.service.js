import axios from 'axios'
import { last } from 'lodash'

import InternalServer from '~/errors/internalServer.error'
import { asyncTimeout } from '~/utils/helpers'
import { MetricService } from './metric.service'
import { githubAPI, workflowStatus, stageName } from '~/utils/constants'
import { env } from '~/configs/environment'
import { StageService } from './stage.services'
import BadRequest from '~/errors/badRequest.error'

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

const deployToProd = async (repository, version, approve) => {
    try {
        const stages = await StageService.findInstallableProdVersions(repository)
        const lastInstallableVerion = last(stages)
        const { executionId } = lastInstallableVerion

        if (lastInstallableVerion.version !== version) {
            throw new BadRequest('There is a previous version need moving first')
        }

        if (approve) {
            await _octokit.request(githubAPI.WORKFLOW_DISPATCH_ROUTE, {
                owner: env.GITHUB_OWNER,
                repo: repository,
                workflow_id: 'production.yml',
                ref: `master@${version}`,
                inputs: {
                    name: 'Production',
                },
                headers: githubAPI.HEADERS,
            })
        }

        const [deployableVerions, deployedVersion] = await Promise.all([
            StageService.findInstallableProdVersions(repository),
            StageService.update(repository, stageName.TEST, executionId, { requireManualApproval: false }),
        ])

        const res = deployableVerions
            .filter((deployableVerion) => deployableVerion.version !== deployedVersion.version)
            .map((deployableVerion) => deployableVerion.version)

        return res
    } catch (error) {
        if (error instanceof BadRequest) {
            throw new BadRequest(error.message)
        }

        throw new InternalServer(error.message)
    }
}

export const DeploymentService = {
    deploymentCheck,
    deployToProd,
}
