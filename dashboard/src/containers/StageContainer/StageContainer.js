import React from 'react'

import Stage from '~/components/Stage'
import { StageProvider } from '~/contexts/StageContext'

function StageContainer({ stage }) {
    const { repository, codePipelineBranch, commitId, version, status, startDateTime, endDateTime, name, metrics } =
        stage

    let latesBuild = {}

    if (codePipelineBranch || version || commitId || startDateTime || endDateTime) {
        latesBuild = {
            repository,
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

export default React.memo(StageContainer)
