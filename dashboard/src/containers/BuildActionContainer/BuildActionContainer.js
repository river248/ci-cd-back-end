import React, { useCallback, useState } from 'react'
import { isEmpty } from 'lodash'

import BuildAction from '~/components/BuildAction'
import { processName } from '~/utils/constants'
import { stopBuild, triggerPipeline } from '~/apis/pipelineAPI'
import { useStage } from '~/hooks'

function BuildActionContainer() {
    const { latestBuild } = useStage()

    const [branch, setBranch] = useState('')
    const [loading, setLoading] = useState(false)

    const { repository, executionId, status } = latestBuild

    const handleSetBranch = useCallback((event) => {
        setBranch(event.target.value)
    }, [])

    const handleTrigger = useCallback(() => {
        if (!isEmpty(branch)) {
            const callApi = async () => {
                setLoading(true)
                await triggerPipeline(repository, branch)
                setLoading(false)
            }

            callApi()
        }
    }, [branch, repository])

    const handleStop = useCallback(() => {
        const callApi = async () => {
            setLoading(true)
            await stopBuild(repository, executionId)
            setLoading(false)
        }

        callApi()
    }, [executionId, repository])

    if (isEmpty(latestBuild)) {
        return null
    }

    return (
        <BuildAction
            disableTrigger={loading || isEmpty(branch)}
            disableStop={isEmpty(executionId) || status !== processName.IN_PROGRESS || loading}
            branch={branch}
            onSetBranch={handleSetBranch}
            onTrigger={handleTrigger}
            onStop={handleStop}
        />
    )
}

export default React.memo(BuildActionContainer)
