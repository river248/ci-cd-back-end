import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import CardMedia from '@mui/material/CardMedia'
import CloseIcon from '@mui/icons-material/Close'

import { ModalWrapper, MuiInput, NoImage } from '~/components/GlobalStyles/GlobalStyles.mui'
import Button from '~/components/Button/Button'
import { useFirebaseImage } from '~/hooks'

function RemoveRepository({ name, imageUrl, disabled, onRemove, onChange, onClose }) {
    const thumbnail = useFirebaseImage(imageUrl)

    return (
        <ModalWrapper>
            <Stack direction={'row'} alignItems={'flex-start'} marginBottom={1}>
                <Typography marginTop={0.5} fontSize={16} variant={'h4'} component={'h4'} fontWeight={600} flexGrow={1}>
                    Delete repository {name}
                </Typography>
                <IconButton onClick={onClose} size={'small'}>
                    <CloseIcon />
                </IconButton>
            </Stack>

            <Divider />
            <Box marginY={1}>
                {thumbnail ? (
                    <CardMedia sx={{ height: 140, borderRadius: 1 }} image={thumbnail} title={'remove image'} />
                ) : (
                    <NoImage />
                )}
            </Box>
            <Divider />
            <Typography fontSize={14} variant={'h5'} component={'h5'} sx={{ userSelect: 'none' }} marginY={1}>
                To confirm, type <strong>{name}</strong> in the box below
            </Typography>
            <MuiInput fullWidth onChange={onChange} sx={{ marginBottom: 1 }} />
            <Button
                fullWidth
                disabled={disabled}
                uppercase={false}
                variant={'contained'}
                defaultText={false}
                onClick={onRemove}
            >
                Delete this repository
            </Button>
        </ModalWrapper>
    )
}

RemoveRepository.propTypes = {
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    onRemove: PropTypes.func,
    onChange: PropTypes.func,
    onClose: PropTypes.func,
}

export default React.memo(RemoveRepository)
