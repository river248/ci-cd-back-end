import React from 'react'
import PropTypes from 'prop-types'

import { Header, Wrapper } from './StageCard.styles'

function StageCard({ title, children }) {
    return (
        <Wrapper>
            {title && (
                <Header variant={'h6'} component={'div'} textTransform={'uppercase'}>
                    {title}
                </Header>
            )}
            {children}
        </Wrapper>
    )
}

StageCard.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node.isRequired,
}

export default React.memo(StageCard)
