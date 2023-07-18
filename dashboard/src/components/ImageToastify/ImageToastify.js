import React from 'react'
import PropTypes from 'prop-types'
import parse from 'html-react-parser'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

function ImageToastify({ closeToast, image, content }) {
    return (
        <Stack direction={'row'} alignItems={'center'} onClick={closeToast}>
            <Avatar alt={'Avatar'} src={image} sx={{ width: 40, height: 40, marginRight: 1 }} />
            <Typography component={'div'}>{parse(content)}</Typography>
        </Stack>
    )
}

ImageToastify.propTypes = {
    image: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    closeToast: PropTypes.func,
}

export default React.memo(ImageToastify)
