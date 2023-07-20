import React, { useEffect, useState } from 'react'
import { fetchQueue } from '~/apis/pipelineAPI'

import QueueBuild from '~/components/QueueBuild'
import { useQueryHook } from '~/hooks'

function QueueBuildContainer() {
    const query = useQueryHook()
    const REPOSITORY = query.get('repo')
    const [tagNames, setTagNames] = useState([])

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
