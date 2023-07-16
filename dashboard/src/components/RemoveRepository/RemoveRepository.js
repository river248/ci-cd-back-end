import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import CloseIcon from '@mui/icons-material/Close'

import { ModalWrapper, MuiInput } from '~/components/GlobalStyles/GlobalStyles.mui'
import Button from '~/components/Button/Button'

function RemoveRepository({ name, disabled, onRemove, onChange, onClose }) {
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

            <Typography
                fontSize={14}
                variant={'h5'}
                component={'h5'}
                sx={{ userSelect: 'none' }}
                marginTop={2}
                marginBottom={1}
            >
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
    disabled: PropTypes.bool,
    onRemove: PropTypes.func,
    onChange: PropTypes.func,
    onClose: PropTypes.func,
}

export default React.memo(RemoveRepository)
