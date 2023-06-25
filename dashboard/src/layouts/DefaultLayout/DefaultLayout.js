import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'

import Header from './Header/Header'

function DefaultLayout({ children }) {
    return (
        <Fragment>
            <Header />
            <Box flexGrow={1} paddingTop={9}>
                {children}
            </Box>
        </Fragment>
    )
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
}

export default DefaultLayout
