import React from 'react'
import PropTypes from 'prop-types'

import { Content, MuiButton } from './Button.styles'

function Button({ children, uppercase = true, italic, ...passProps }) {
    return (
        <MuiButton uppercase={uppercase.toString()} {...passProps}>
            <Content italic={italic.toString()}>{children}</Content>
        </MuiButton>
    )
}

Button.propTypes = {
    children: PropTypes.string.isRequired,
    uppercase: PropTypes.bool,
    italic: PropTypes.bool,
}

export default React.memo(Button)
