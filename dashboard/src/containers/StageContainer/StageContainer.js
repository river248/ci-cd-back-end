import React from 'react'
import PropTypes from 'prop-types'

import Stage from '~/components/Stage'
import { StageProvider } from '~/contexts/StageContext'
import { processName } from '~/utils/constants'

function StageContainer({ stage }) {
    const { codePipelineBranch, commitId, version, status, startDateTime, endDateTime, name, metrics } = stage

    let latesBuild = {}

    if (codePipelineBranch || version || commitId || startDateTime || endDateTime) {
        latesBuild = {
            codePipelineBranch,
            version,
            commitId,
            startDateTime,
            endDateTime,
        }
    }

    const value = {
        latesBuild,
        metrics,
    }

    return (
        <StageProvider value={value}>
            <Stage name={name} status={status} />
        </StageProvider>
    )
}

StageContainer.propTypes = {
    latesBuild: PropTypes.shape({
        branch: PropTypes.string,
        version: PropTypes.string,
        commit: PropTypes.string,
        startTime: PropTypes.string,
        duration: PropTypes.string,
    }),
    metrics: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            actual: PropTypes.number,
            total: PropTypes.number,
            status: PropTypes.oneOf([
                processName.QUEUED,
                processName.IN_PROGRESS,
                processName.FAILURE,
                processName.SUCCESS,
            ]),
        }),
    ),
}

export default React.memo(StageContainer)
