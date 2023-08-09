import PropTypes from 'prop-types'

import { processName } from './constants'

export const REPOSITORY = PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    stages: PropTypes.arrayOf(PropTypes.string),
    thumbnail: PropTypes.string.isRequired,
    members: PropTypes.arrayOf(PropTypes.string),
})

export const EXECUTION = PropTypes.shape({
    _id: PropTypes.string.isRequired,
    executionId: PropTypes.string.isRequired,
    name: PropTypes.oneOf(['build', 'test', 'production']).isRequired,
    repository: PropTypes.string.isRequired,
    codePipelineBranch: PropTypes.string.isRequired,
    commitId: PropTypes.string.isRequired,
    status: PropTypes.oneOf([processName.SUCCESS, processName.FAILURE]),
    version: PropTypes.string.isRequired,
    buildStartTime: PropTypes.string.isRequired,
    requireManualApproval: PropTypes.bool,
    deploymentId: PropTypes.string,
    startDateTime: PropTypes.string.isRequired,
    endDateTime: PropTypes.string.isRequired,
})

export const STAGE = PropTypes.shape({
    _id: PropTypes.string,
    repository: PropTypes.string,
    name: PropTypes.string,
    executionId: PropTypes.string,
    version: PropTypes.string,
    status: PropTypes.oneOf([processName.QUEUED, processName.IN_PROGRESS, processName.SUCCESS, processName.FAILURE]),
    codePipelineBranch: PropTypes.string,
    metrics: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string,
            name: PropTypes.string,
            rank: PropTypes.number,
            actual: PropTypes.number,
            total: PropTypes.number,
            status: PropTypes.oneOf([
                processName.QUEUED,
                processName.IN_PROGRESS,
                processName.SUCCESS,
                processName.FAILURE,
            ]),
            appMetrics: PropTypes.arrayOf(
                PropTypes.shape({
                    name: PropTypes.string,
                    actual: PropTypes.number,
                    total: PropTypes.number,
                    reportUrl: PropTypes.string,
                }),
            ),
            completedAt: PropTypes.string,
            executionId: PropTypes.string,
            startedAt: PropTypes.string,
        }),
    ),
    commitId: PropTypes.string,
    deploymentId: PropTypes.string,
    buildStartTime: PropTypes.string,
    endDateTime: PropTypes.string,
    startDateTime: PropTypes.string,
})
