import { isEmpty } from 'lodash'
import React, { useContext } from 'react'

import Metric from '~/components/Metric'
import { StageContext } from '~/contexts/StageContext'

function MetricContainer() {
    const { metrics } = useContext(StageContext)

    if (isEmpty(metrics)) {
        return null
    }

    return metrics.map((metric) => (
        <Metric
            key={metric.name}
            name={metric.name}
            actual={metric.actual}
            total={metric.total}
            status={metric.status}
        />
    ))
}

export default React.memo(MetricContainer)
