import React, { useCallback, useContext, useState } from 'react'
import { isEmpty } from 'lodash'

import BuildAction from '~/components/BuildAction'
import { processName } from '~/utils/constants'
import { StageContext } from '~/contexts/StageContext'
import { triggerPipeline } from '~/apis'

function BuildActionContainer() {
    const { latesBuild } = useContext(StageContext)

    if (isEmpty(latesBuild)) {
        return null
    }

    const { repository, status } = latesBuild

    const [branch, setBranch] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSetBranch = useCallback(
        (event) => {
            setBranch(event.target.value)
        },
        [branch],
    )

    const handleTrigger = useCallback(() => {
        if (!isEmpty(branch)) {
            const callApi = async () => {
                setLoading(true)
                await triggerPipeline(repository, branch)
                setLoading(false)
            }

            callApi()
        }
    }, [branch])

    const handleStop = useCallback(() => {
        console.log('stop build')
    }, [branch])

    return (
        <BuildAction
            disableTrigger={loading || isEmpty(branch)}
            disableStop={status !== processName.IN_PROGRESS || loading || isEmpty(branch)}
            branch={branch}
            onSetBranch={handleSetBranch}
            onTrigger={handleTrigger}
            onStop={handleStop}
        />
    )
}

export default React.memo(BuildActionContainer)
