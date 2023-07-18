import React, { useState, useEffect, useCallback } from 'react'
import { isEmpty, last } from 'lodash'
import { toast } from 'react-toastify'

import ProceedToProd from '~/components/ProceedToProd'
import { useAuth, useQueryHook } from '~/hooks'
import { fetchInstallableProdVerions } from '~/apis/stageAPI'
import { deployToProd } from '~/apis/deploymentAPI'
import { socket, socketEvent } from '~/utils/constants'
import ImageToastify from '~/components/ImageToastify'

function ProceedToProdContainer() {
    const [loading, setLoading] = useState(false)
    const [deployVersion, setDeployVersion] = useState('')
    const query = useQueryHook()
    const { user } = useAuth

    useEffect(() => {
        socket.on(socketEvent.DEPLOY_TO_PRODUCTION, (res) => {
            const { userData, stageData, approve } = res

            if (userData.userId !== user.userId) {
                toast.info(
                    <ImageToastify
                        image={userData.avatar}
                        content={`<strong>${userData.name}</strong> has just ${
                            approve ? 'deployed' : 'rejected'
                        } version <strong>${stageData.version}</strong> !`}
                    />,
                    { icon: false },
                )
            }
        })

        return () => socket.off(socketEvent.DEPLOY_TO_PRODUCTION)
    }, [])

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
