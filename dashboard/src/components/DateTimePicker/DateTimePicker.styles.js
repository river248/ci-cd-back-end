import { styled } from '@mui/material/styles'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import { textFieldStyles } from '~/components/GlobalStyles/GlobalStyles.mui'

export const MuiDatePicker = styled(DatePicker)(({ theme }) => ({
    marginTop: theme.spacing(-1),
    ...textFieldStyles(theme),
}))
