import React from 'react'
import PropTypes from 'prop-types'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

function LatesBuild({ dataName, hasLink, toolTipContent, dataValue, onGoto }) {
    const theme = useTheme()
    return (
        <Stack marginTop={1} direction={'row'}>
            <Typography width={'30%'} variant={'h6'} component={'span'} fontWeight={'normal'} fontSize={14}>
                {dataName}:
            </Typography>
            <Tooltip arrow title={toolTipContent}>
                {hasLink ? (
                    <Typography component={'div'} width={'70%'} noWrap>
                        <Typography
                            variant={'h6'}
                            component={'span'}
                            fontWeight={'normal'}
                            fontSize={14}
                            sx={{ cursor: 'pointer', textDecoration: 'underline', color: theme.palette.primary.main }}
                            onClick={() => onGoto(dataName, dataValue)}
                        >
                            {dataValue}
                        </Typography>
                    </Typography>
                ) : (
                    <Typography
                        width={'70%'}
                        variant={'h6'}
                        component={'span'}
                        fontWeight={'normal'}
                        fontSize={14}
                        noWrap
                    >
                        {dataValue}
                    </Typography>
                )}
            </Tooltip>
        </Stack>
    )
}

LatesBuild.propTypes = {
    dataName: PropTypes.string,
    hasLink: PropTypes.bool,
    toolTipContent: PropTypes.string,
    dataValue: PropTypes.string,
    onGoto: PropTypes.func,
}

export default React.memo(LatesBuild)
