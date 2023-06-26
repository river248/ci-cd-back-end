import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'

import HeaderLayoutContainer from '~/containers/HeaderLayoutContainer'

function DefaultLayout({ children }) {
    return (
        <Fragment>
            <HeaderLayoutContainer />
            <Box flexGrow={1} paddingTop={7.5}>
                {children}
            </Box>
        </Fragment>
    )
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
}

export default DefaultLayout
