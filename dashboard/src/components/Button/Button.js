import React from 'react'
import PropTypes from 'prop-types'
import MuiButton from '@mui/material/Button'

import { Content } from './Button.styles'

function Button({ children, uppercase = true, italic = false, defaultText = true, ...passProps }) {
    return (
        <MuiButton {...passProps}>
            <Content uppercase={`${uppercase}`} italic={`${italic}`} defaultText={`${defaultText}`}>
                {children}
            </Content>
        </MuiButton>
    )
}

Button.propTypes = {
    children: PropTypes.string.isRequired,
    uppercase: PropTypes.bool,
    italic: PropTypes.bool,
    italic: PropTypes.bool,
}

export default React.memo(Button)
