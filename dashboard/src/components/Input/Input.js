import React from 'react'
import TextField from '@mui/material/TextField'
import { useTheme } from '@mui/material/styles'

function Input({ ...passProps }) {
    const theme = useTheme()
    const styles = {
        borderRadius: 1,
        background: theme.palette.common.white,

        ' .MuiInputBase-input': {
            color: theme.palette.common.black,
        },
        ' .MuiOutlinedInput-notchedOutline': {
            border: 0,
        },
    }

    return <TextField size={'small'} sx={styles} {...passProps} />
}

export default React.memo(Input)
