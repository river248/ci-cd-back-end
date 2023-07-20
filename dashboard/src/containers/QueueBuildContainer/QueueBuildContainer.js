import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { first } from 'lodash'

import QueueBuild from '~/components/QueueBuild'
import { useAuth, useQueryHook } from '~/hooks'
import { socket, socketEvent } from '~/utils/constants'
import { fetchQueue } from '~/apis/pipelineAPI'
import ImageToastify from '~/components/ImageToastify/ImageToastify'

function QueueBuildContainer() {
    const query = useQueryHook()
    const REPOSITORY = query.get('repo')
    const [tagNames, setTagNames] = useState([])
    const { user } = useAuth()

    useEffect(() => {
        socket.on(socketEvent.UPDATE_QUEUE, (res) => {
            const { action, tagName, userData } = res

            if (action === 'push') {
                if (userData.userId !== user.userId) {
                    toast.info(
                        <ImageToastify
                            image={userData.avatar}
                            content={`<strong>${userData.name}</strong> has just pushed <strong>${tagName}</strong> to queue !`}
                        />,
                        { icon: false },
                    )
                }

                setTagNames((prev) => [...prev, tagName])
            } else {
                setTagNames((prev) => {
                    if (first(prev) === tagName) {
                        const clonePrev = [...prev]
                        clonePrev.shift()
                        return clonePrev
                    } else {
                        toast.info('Someone has updated. Please reload page to see new data!')
                        return prev
                    }
                })
            }
        })

        return () => socket.off(socketEvent.UPDATE_QUEUE)
    }, [])

    useEffect(() => {
        fetchQueue(REPOSITORY).then((res) => {
            if (res) {
                setTagNames(res.map((waitingBuild) => waitingBuild.tagName))
            }
        })
    }, [REPOSITORY])

    return <QueueBuild tagNames={tagNames} />
}

export default React.memo(QueueBuildContainer)
