import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { countBy, groupBy } from 'lodash'
import { getDate } from 'date-fns'
import { useTheme } from '@mui/material/styles'

import { EXECUTION } from '~/utils/apiPropTypes'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

function ExecutionChartContainer({ chartName, executions }) {
    const theme = useTheme()
    const options = useMemo(
        () => ({
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date',
                    },
                },
                y: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Number',
                    },
                    ticks: {
                        stepSize: 1,
                    },
                    beginAtZero: true,
                },
            },
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: chartName.toUpperCase(),
                },
            },
        }),
        [chartName],
    )

    const data = useMemo(() => {
        const groupByDate = groupBy(executions, (execution) => getDate(new Date(execution.buildStartTime)))
        const labels = []
        const builds = []
        const deployments = []

        for (const key in groupByDate) {
            const countByStage = countBy(groupByDate[key], (execution) => execution.name)

            labels.push(key)
            deployments.push((countByStage.production ?? 0) + (countByStage.test ?? 0))
            builds.push(countByStage.build ?? 0)
        }

        return {
            labels,
            datasets: [
                {
                    label: 'build',
                    data: builds,
                    borderColor: theme.palette.info.light,
                    backgroundColor: theme.palette.info.dark,
                },
                {
                    label: 'deployment',
                    data: deployments,
                    borderColor: theme.palette.success.light,
                    backgroundColor: theme.palette.success.dark,
                },
            ],
        }
    }, [JSON.stringify(executions)])

    return <Line options={options} data={data} />
}

ExecutionChartContainer.propTypes = {
    chartName: PropTypes.string.isRequired,
    executions: PropTypes.arrayOf(EXECUTION),
}

export default React.memo(ExecutionChartContainer)
