import React from 'react'
import PropTypes from 'prop-types'

import { MuiTitle } from './Title.styles'

function Title({ content }) {
    return <MuiTitle>{content}</MuiTitle>
}

Title.propTypes = {
    content: PropTypes.string.isRequired,
}

export default React.memo(Title)
