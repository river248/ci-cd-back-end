import React, { useContext, useState, Fragment, useMemo, useCallback } from 'react'
import { cloneDeep, isEmpty, isNil } from 'lodash'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import { useTheme } from '@mui/material/styles'

import Metric from '~/components/Metric'
import { StageContext } from '~/contexts/StageContext'
import AppMetricsContainer from '~/containers/AppMetricsContainer'

function MetricContainer() {
    const { latestBuild, metrics } = useContext(StageContext)

    const [open, setOpen] = useState(false)
    const [appMetrics, setAppMetrics] = useState([])

    const theme = useTheme()

    if (isEmpty(metrics) || isNil(metrics)) {
        return null
    }

    const boxStyles = useMemo(() => ({
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: theme.palette.common.white,
        boxShadow: 24,
        padding: theme.spacing(4),
        borderRadius: 1,
        outline: 'none',
    }))

    const sortedMetrics = cloneDeep(metrics)
    sortedMetrics.sort((metricA, metricB) => metricA.rank - metricB.rank)

    const handleOpenAppMetric = useCallback((metricName) => {
        const appMetricsData = metrics.find((metric) => metricName === metric.name)?.appMetrics ?? []
        const newAppMetrics = appMetricsData.map((item) => ({
            ...item,
            metric: metricName,
            stage: latestBuild.stage,
            version: latestBuild.version,
            deployment: null,
        }))

        setAppMetrics(newAppMetrics)
        setOpen(true)
    }, [])

    const handleCloseAppMetric = useCallback(() => {
        setOpen(false)
    }, [])

    return (
        <Fragment>
            <Modal open={open} onClose={handleCloseAppMetric}>
                <Box sx={boxStyles}>
                    <AppMetricsContainer appMetrics={appMetrics} />
                </Box>
            </Modal>
            {sortedMetrics.map((metric) => (
                <Metric
                    key={metric.name}
                    name={metric.name}
                    actual={metric.actual}
                    total={metric.total}
                    status={metric.status}
                    hasPopup={!isEmpty(metric.appMetrics) && !isNil(metric.appMetrics)}
                    onOpen={handleOpenAppMetric}
                />
            ))}
        </Fragment>
    )
}

export default React.memo(MetricContainer)
