import React from 'react'

import Stage from '~/components/Stage'
import { StageProvider } from '~/contexts/StageContext'

function StageContainer({ stage }) {
    const {
        repository,
        executionId,
        codePipelineBranch,
        commitId,
        version,
        status,
        startDateTime,
        endDateTime,
        name,
        metrics,
    } = stage

    let latestBuild = {}

    if (repository && name && executionId) {
        latestBuild = {
            stage: name,
            repository,
            executionId,
            codePipelineBranch,
            version,
            commitId,
            startDateTime,
            endDateTime,
        }
    }

    const value = {
        latestBuild,
        metrics,
    }

    return (
        <StageProvider value={value}>
            <Stage name={name} status={status} />
        </StageProvider>
    )
}

export default React.memo(StageContainer)
