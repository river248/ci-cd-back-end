import React, { useState, useEffect, useCallback } from 'react'
import { isEmpty, last } from 'lodash'

import ProceedToProd from '~/components/ProceedToProd'
import { useQueryHook } from '~/hooks'
import { fetchInstallableProdVerions } from '~/apis/stageAPI'
import { deployToProd } from '~/apis/deploymentAPI'

function ProceedToProdContainer() {
    const [loading, setLoading] = useState(false)
    const [deployVersion, setDeployVersion] = useState('')
    const query = useQueryHook()

    useEffect(() => {
        setLoading(true)
        getInstallableProdVerions()
    }, [query.get('repo')])

    const getInstallableProdVerions = useCallback(() => {
        const callApi = async () => {
            const installableProdVersions = await fetchInstallableProdVerions(query.get('repo'))

            if (!isEmpty(installableProdVersions)) {
                const deployVersion = last(installableProdVersions).version
                setDeployVersion(deployVersion)
            }

            setLoading(false)
        }

        callApi()
    }, [query.get('repo')])

    const handleApproveOrRejectDeploy = useCallback(
        (deployVersion, approve) => {
            const callApi = async () => {
                setLoading(true)
                await deployToProd(query.get('repo'), deployVersion, approve)
                getInstallableProdVerions()
            }

            callApi()
        },
        [query.get('repo')],
    )

    return (
        <ProceedToProd
            version={deployVersion}
            disabled={loading || isEmpty(deployVersion)}
            onApproveOrReject={handleApproveOrRejectDeploy}
        />
    )
}

export default React.memo(ProceedToProdContainer)
