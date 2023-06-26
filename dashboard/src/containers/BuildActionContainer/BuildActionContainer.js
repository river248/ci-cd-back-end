import React, { useCallback, useState } from 'react'
import { isEmpty } from 'lodash'

import BuildAction from '~/components/BuildAction'

function BuildActionContainer() {
    const [branch, setBranch] = useState('')
    const [disabled, setDisabled] = useState(false)

    const handleSetBranch = useCallback(
        (event) => {
            setBranch(event.target.value)
        },
        [branch],
    )

    const handleTrigger = useCallback(() => {
        if (!isEmpty(branch)) {
            setDisabled(true)
            setTimeout(() => {
                console.log('build')
                setDisabled(false)
            }, 1000)
        }
    }, [branch])

    const handleStop = useCallback(() => {
        console.log('stop build')
    }, [branch])

    console.log(disabled)
    return (
        <BuildAction
            disabled={disabled}
            branch={branch}
            onSetBranch={handleSetBranch}
            onTrigger={handleTrigger}
            onStop={handleStop}
        />
    )
}

export default React.memo(BuildActionContainer)
