import React from 'react'
import PropTypes from 'prop-types'
import Autocomplete from '@mui/material/Autocomplete'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import FormGroup from '@mui/material/FormGroup'
import CardMedia from '@mui/material/CardMedia'
import { useTheme } from '@mui/material/styles'

import { MuiInput, MuiLabel, Wrapper } from './AddNewRepository.styles'
import Button from '~/components/Button'

function AddNewRepository({
    members,
    overSizeError,
    previewImage,
    textError,
    multiTextError,
    loading,
    onChangeName,
    onSelectMember,
    onChooseFile,
    onSubmit,
}) {
    const theme = useTheme()

    return (
        <Wrapper>
            <Typography variant={'h2'} component={'h2'} fontSize={21} fontWeight={600}>
                Add new repository
            </Typography>
            <Stack marginTop={2}>
                <Typography marginBottom={0.5} fontSize={15} variant={'h5'} component={'h5'}>
                    Name
                </Typography>
                <MuiInput
                    disabled={loading}
                    error={textError}
                    fullWidth
                    placeholder={'Enter repositoy name'}
                    helperText={
                        textError ? 'Repo name must be greater than 3 characters and less than 51 characters' : ''
                    }
                    onChange={onChangeName}
                />
            </Stack>
            <Stack marginTop={2}>
                <Typography marginBottom={0.5} fontSize={15} variant={'h5'} component={'h5'}>
                    Members
                </Typography>
                <Autocomplete
                    multiple
                    options={members}
                    disabled={loading}
                    getOptionLabel={(option) => option.name}
                    filterSelectedOptions
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    onChange={onSelectMember}
                    renderInput={(params) => (
                        <MuiInput
                            {...params}
                            size={'small'}
                            placeholder={'Select members'}
                            error={multiTextError}
                            helperText={multiTextError ? 'Members name must be required' : ''}
                        />
                    )}
                />
            </Stack>
            <FormGroup>
                <MuiLabel
                    disabled={loading}
                    control={
                        <input style={{ display: 'none' }} type={'file'} accept={'image/*'} onChange={onChooseFile} />
                    }
                    label={'Choose image'}
                />
                {overSizeError && (
                    <Typography
                        component={'span'}
                        color={theme.palette.error.main}
                        fontSize={13}
                        marginTop={1}
                        paddingLeft={1}
                    >
                        File must be less than 1MB
                    </Typography>
                )}

                {previewImage && (
                    <CardMedia
                        sx={{ height: 140, marginTop: 1, borderRadius: 1 }}
                        image={previewImage}
                        title={'previre image'}
                    />
                )}
            </FormGroup>

            <Button
                disabled={loading}
                uppercase={false}
                defaultText={false}
                fullWidth
                variant={'contained'}
                onClick={onSubmit}
                sx={{ marginTop: 2 }}
            >
                Add
            </Button>
        </Wrapper>
    )
}

AddNewRepository.propTypes = {
    members: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        }),
    ),
    loading: PropTypes.bool,
    overSizeError: PropTypes.bool,
    textError: PropTypes.bool,
    multiTextError: PropTypes.bool,
    previewImage: PropTypes.string,
    onChangeName: PropTypes.func,
    onSelectMember: PropTypes.func,
    onChooseFile: PropTypes.func,
    onSubmit: PropTypes.func,
}

export default React.memo(AddNewRepository)
