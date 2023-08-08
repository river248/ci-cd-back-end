import React from 'react'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

import { MuiDatePicker } from './DateTimePicker.styles'

function DateTimePicker({ ...passProps }) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
                <MuiDatePicker {...passProps} />
            </DemoContainer>
        </LocalizationProvider>
    )
}

export default React.memo(DateTimePicker)
