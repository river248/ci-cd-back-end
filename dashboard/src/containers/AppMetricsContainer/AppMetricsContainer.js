import React, { Fragment, useMemo } from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { useTheme } from '@mui/material/styles'

function AppMetricsContainer({ appMetrics }) {
    const theme = useTheme()

    const header = useMemo(
        () => [
            { title: 'Metric', width: 180 },
            { title: 'Stage', width: 120 },
            { title: 'Deployment', width: 120 },
            { title: 'Version', width: 100 },
            { title: 'Test ID', width: 120 },
            { title: 'Result', width: 120 },
            { title: 'Report', width: 100 },
        ],
        [],
    )

    const listAppMetrics = appMetrics.map((item) => [
        { value: item.metric, width: 180 },
        { value: item.stage, width: 120 },
        { value: item.deployment, width: 120 },
        { value: item.version, width: 100 },
        { value: item.name, width: 120 },
        { value: `${item.actual}/${item.total}`, width: 120 },
        { value: item.reportUrl, width: 100 },
    ])

    const linkStyles = useMemo(
        () => ({
            fontSize: 14,
            textDecoration: 'none',
            padding: theme.spacing(0.5, 1),
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.palette.primary.main,
            borderRadius: 1,
        }),
        [],
    )

    return (
        <Box>
            <Stack direction={'row'} spacing={1}>
                {header.map((item) => (
                    <Typography
                        key={item.title}
                        sx={{ width: item.width, fontSize: 15, fontWeight: 600 }}
                        component={'span'}
                    >
                        {item.title}
                    </Typography>
                ))}
            </Stack>
            {listAppMetrics.map((appMetric, index) => (
                <Stack key={index} direction={'row'} alignItems={'center'} spacing={1} marginTop={1}>
                    {appMetric.map((item, idx) => (
                        <Fragment key={idx}>
                            {idx !== appMetric.length - 1 ? (
                                <Typography sx={{ width: item.width, fontSize: 15 }} component={'span'}>
                                    {item.value}
                                </Typography>
                            ) : (
                                <Fragment>
                                    {item.value && (
                                        <Box>
                                            <Link sx={linkStyles} href={item.value} target={'_blank'}>
                                                Report
                                            </Link>
                                        </Box>
                                    )}
                                </Fragment>
                            )}
                        </Fragment>
                    ))}
                </Stack>
            ))}
        </Box>
    )
}

AppMetricsContainer.propTypes = {
    appMetrics: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            metric: PropTypes.string,
            stage: PropTypes.string,
            version: PropTypes.string,
            actual: PropTypes.number,
            total: PropTypes.number,
            deployment: PropTypes.string,
            reportUrl: PropTypes.string,
        }),
    ),
}

export default React.memo(AppMetricsContainer)
