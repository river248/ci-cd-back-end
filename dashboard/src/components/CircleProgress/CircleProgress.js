import React from 'react'
import PropTypes from 'prop-types'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

import { Container } from './CircleProgress.styles'

function CircleProgress({ value, fontSize, ...passProps }) {
    const theme = useTheme()

    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
                variant={'determinate'}
                sx={{
                    color: (theme) => theme.palette.grey[200],
                    position: 'absolute',
                }}
                value={100}
                {...passProps}
            />
            <CircularProgress variant={'determinate'} value={value} {...passProps} />
            <Container>
                <Typography
                    fontSize={fontSize}
                    fontWeight={500}
                    variant={'caption'}
                    component={'div'}
                    color={theme.palette.common.black}
                >
                    {value}%
                </Typography>
            </Container>
        </Box>
    )
}

CircleProgress.propTypes = {
    value: PropTypes.number.isRequired,
    fontSize: PropTypes.number,
}

export default React.memo(CircleProgress)
