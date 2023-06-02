import React from 'react'

import { socketEvent } from '~/utils/constants'

function Dashboard() {
    useEffect(() => {
        socket.emit(socketEvent.USING_PIPELINE, user.userId)

        return () => socket.off(socketEvent.USING_PIPELINE)
    }, [])

    return <div>Dashboard</div>
}

export default Dashboard
