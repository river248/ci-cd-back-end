import React from 'react'
import MuiButton from '@mui/material/Button'
import PropTypes from 'prop-types'

import { Content } from './Button.styles'

function Button({ children, ...passProps }) {
    return (
        <MuiButton {...passProps}>
            <Content>{children}</Content>
        </MuiButton>
    )
}

Button.propTypes = {
    children: PropTypes.string.isRequired,
}

export default React.memo(Button)
