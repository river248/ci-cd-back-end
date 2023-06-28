import React, { useContext } from 'react'
import { cloneDeep, isEmpty, isNil } from 'lodash'

import Metric from '~/components/Metric'
import { StageContext } from '~/contexts/StageContext'

function MetricContainer() {
    const { metrics } = useContext(StageContext)

    if (isEmpty(metrics) || isNil(metrics)) {
        return null
    }

    const sortedMetrics = cloneDeep(metrics)
    sortedMetrics.sort((metricA, metricB) => metricA.rank - metricB.rank)

    const handleOpenAppMetric = (metricName) => {
        console.log(metricName)
    }

    return sortedMetrics.map((metric) => (
        <Metric
            key={metric.name}
            name={metric.name}
            actual={metric.actual}
            total={metric.total}
            status={metric.status}
            hasPopup={true}
            onOpen={handleOpenAppMetric}
        />
    ))
}

export default React.memo(MetricContainer)
