import React from 'react'
import PropTypes from 'prop-types'

import Stage from '~/components/Stage'
import { StageProvider } from '~/contexts/StageContext'
import { processName } from '~/utils/constants'

function StageContainer({ latesBuild, metrics }) {
    const value = {
        latesBuild,
        metrics,
    }

    return (
        <StageProvider value={value}>
            <Stage />
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
