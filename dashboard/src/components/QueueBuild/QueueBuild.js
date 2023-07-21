import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Skeleton from '@mui/material/Skeleton'
import { isEmpty } from 'lodash'

import StageCard from '~/components/StageCard'

function QueueBuild({ tagNames, loading }) {
    if (loading) {
        return (
            <StageCard>
                <Skeleton variant={'text'} width={100} sx={{ margin: '0 auto', fontSize: '1.8rem' }} />
                <Stack spacing={1} marginTop={1}>
                    {tagNames.map((item) => (
                        <Paper sx={{ padding: 1 }} key={item}>
                            <Skeleton variant={'text'} />
                        </Paper>
                    ))}
                </Stack>
            </StageCard>
        )
    }

    return (
        <StageCard title={'queue'}>
            <Stack spacing={1}>
                {isEmpty(tagNames) && (
                    <Paper sx={{ padding: 1 }}>
                        <Typography fontSize={14}>There is no verion</Typography>
                    </Paper>
                )}

                {tagNames.map((tagName) => (
                    <Paper key={tagName} sx={{ padding: 1 }}>
                        <Tooltip arrow title={tagName.length > 32 ? tagName : ''}>
                            <Typography fontSize={14} fontStyle={'italic'} fontWeight={600} noWrap>
                                {tagName}
                            </Typography>
                        </Tooltip>
                    </Paper>
                ))}
            </Stack>
        </StageCard>
    )
}

QueueBuild.propTypes = {
    loading: PropTypes.bool,
    tagNames: PropTypes.arrayOf(PropTypes.string.isRequired),
}

export default React.memo(QueueBuild)
