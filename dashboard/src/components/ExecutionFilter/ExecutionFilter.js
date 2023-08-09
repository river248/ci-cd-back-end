import React from 'react'
import PropTypes from 'prop-types'
import Stack from '@mui/material/Stack'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

import DateTimePicker from '~/components/DateTimePicker'
import { MuiSelect } from '~/components/GlobalStyles/GlobalStyles.mui'
import Button from '~/components/Button'

function ExecutionFilter({ options, selectedOption, disabled, onSelect, onDatePicker, onSearch }) {
    const theme = useTheme()

    return (
        <Stack direction={'row'}>
            <FormControl sx={{ flexDirection: 'row', alignItems: 'center' }}>
                <Typography fontSize={14} fontWeight={600} color={theme.palette.common.white} component={'span'}>
                    Repository:
                </Typography>
                <MuiSelect sx={{ marginLeft: 1, width: 200 }} value={selectedOption} onChange={onSelect}>
                    <MenuItem value={''}>
                        <em>None</em>
                    </MenuItem>
                    {options.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </MuiSelect>
            </FormControl>
            <Stack marginLeft={1} spacing={1} direction={'row'} alignItems={'center'}>
                <Typography fontSize={14} fontWeight={600} color={theme.palette.common.white} component={'span'}>
                    From date:
                </Typography>
                <DateTimePicker sx={{ width: 150 }} onChange={(value) => onDatePicker('start', value.$d)} />
            </Stack>
            <Stack marginLeft={1} spacing={1} direction={'row'} alignItems={'center'}>
                <Typography fontSize={14} fontWeight={600} color={theme.palette.common.white} component={'span'}>
                    To date:
                </Typography>
                <DateTimePicker sx={{ width: 150 }} onChange={(value) => onDatePicker('end', value.$d)} />
            </Stack>
            <Button
                sx={{ marginLeft: 1 }}
                variant={'contained'}
                size={'small'}
                defaultText={false}
                uppercase={false}
                disabled={disabled}
                onClick={onSearch}
            >
                Search
            </Button>
        </Stack>
    )
}

ExecutionFilter.propTypes = {
    options: PropTypes.arrayOf(PropTypes.string),
    selectedOption: PropTypes.string,
    disabled: PropTypes.bool,
    onSelect: PropTypes.func,
    onDatePicker: PropTypes.func,
    onSearch: PropTypes.func,
}

export default React.memo(ExecutionFilter)
