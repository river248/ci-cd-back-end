import React, { useEffect, useState } from 'react'

import { socket, socketEvent } from '~/utils/constants'

function Dashboard() {
    const [status, setStatus] = useState(null)

    useEffect(() => {
        socket.emit(socketEvent.USING_PIPELINE, 'ci-cd-github-actions')
        socket.on(socketEvent.UPDATE_PIPELINE_DATA, (data) => {
            console.log(data)
            setStatus(data.status)
        })

        return () => {
            socket.off(socketEvent.USING_PIPELINE)
            socket.off(socketEvent.UPDATE_PIPELINE_DATA)
        }
    }, [])

    return <div>{status}</div>
}

export default Dashboard
