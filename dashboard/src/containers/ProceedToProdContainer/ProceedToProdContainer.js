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
    const [versions, setVerisons] = useState([])
    const query = useQueryHook()
    const { user } = useAuth()

    useEffect(() => {
        socket.on(socketEvent.DEPLOY_TO_PRODUCTION, (res) => {
            const { userData, deployableVerions, deployedVerion, approve } = res

            if (userData.userId !== user.userId) {
                toast.info(
                    <ImageToastify
                        image={userData.avatar}
                        content={`<strong>${userData.name}</strong> has just ${
                            approve ? 'deployed' : 'rejected'
                        } version <strong>${deployedVerion}</strong> !`}
                    />,
                    { icon: false },
                )
            }

            setVerisons(deployableVerions)
        })

        socket.on(socketEvent.UPDATE_DEPLOYABLED_PRODUCTION, (deployableVerions) => {
            setVerisons(deployableVerions)
        })

        return () => {
            socket.off(socketEvent.DEPLOY_TO_PRODUCTION)
            socket.off(socketEvent.UPDATE_DEPLOYABLED_PRODUCTION)
        }
    }, [])

    useEffect(() => {
        const callApi = async () => {
            setLoading(true)
            const deployableVersions = await fetchInstallableProdVerions(query.get('repo'))
            const mapToVersions = deployableVersions.map((deployableVersion) => deployableVersion.version)
            setVerisons(mapToVersions)
            setLoading(false)
        }

        callApi()
    }, [query.get('repo')])

    const handleApproveOrRejectDeploy = useCallback(
        (deployVersion, approve) => {
            const callApi = async () => {
                setLoading(true)
                await deployToProd(query.get('repo'), deployVersion, approve)
                setLoading(false)
            }

            callApi()
        },
        [query.get('repo')],
    )

    return (
        <ProceedToProd
            version={last(versions) ?? ''}
            disabled={loading || isEmpty(versions)}
            onApproveOrReject={handleApproveOrRejectDeploy}
        />
    )
}

export default React.memo(ProceedToProdContainer)
