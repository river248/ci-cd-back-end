import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { format } from 'date-fns'

function LatesBuild({ data }) {
    const { branch, version, commit, startTime, duration } = data
    const convertToMetadata = () => [
        { name: 'Branch:', value: branch, tooltip: branch?.length > 21 ? branch : '' },
        { name: 'Version:', value: version, tooltip: '' },
        { name: 'Commit:', value: commit, tooltip: '' },
        { name: 'Start time:', value: format(startTime, 'dd/MM/yyyy HH:mm'), tooltip: '' },
        { name: 'Duration:', value: duration, tooltip: '' },
    ]

    return (
        <Fragment>
            {convertToMetadata().map((item) => (
                <Stack key={item.name} marginTop={1} direction={'row'}>
                    <Typography width={'30%'} variant={'h6'} component={'span'} fontWeight={'normal'} fontSize={14}>
                        {item.name}
                    </Typography>
                    <Tooltip arrow title={item.tooltip}>
                        <Typography
                            width={'70%'}
                            variant={'h6'}
                            component={'span'}
                            fontWeight={'normal'}
                            fontSize={14}
                            noWrap
                        >
                            {item.value}
                        </Typography>
                    </Tooltip>
                </Stack>
            ))}
        </Fragment>
    )
}

LatesBuild.propTypes = {
    data: PropTypes.shape({
        branch: PropTypes.string,
        version: PropTypes.string,
        commit: PropTypes.string,
        startTime: PropTypes.instanceOf(Date),
        duration: PropTypes.string,
    }),
}

export default React.memo(LatesBuild)
