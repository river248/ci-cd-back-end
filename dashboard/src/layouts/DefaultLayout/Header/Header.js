import React, { useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

import { Search, Wrapper } from './Header.styles.js'

function Header() {
    const [anchorEl, setAnchorEl] = useState(null)
    const [open, setOpen] = useState(false)
    const [placement, setPlacement] = useState()
    const theme = useTheme()

    const handleClick = (newPlacement) => (event) => {
        setAnchorEl(event.currentTarget)
        setOpen((prev) => placement !== newPlacement || !prev)
        setPlacement(newPlacement)
    }

    return (
        <Wrapper>
            <Stack height={60} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography
                    variant={'h1'}
                    component={'span'}
                    fontWeight={600}
                    fontSize={24}
                    color={theme.palette.common.white}
                >
                    CI/CD
                </Typography>
                <Search size={'small'} placeholder={'Search...'} />
                <Avatar
                    alt={'User'}
                    src={
                        'https://congluan-cdn.congluan.vn/files/content/2022/05/26/doraemon-nobita-va-cuoc-chien-vu-tru-ti-hon-goi-tron-mua-he-trong-man-anh-183307801.jpg'
                    }
                    sx={{ width: 40, height: 40, cursor: 'pointer' }}
                    onClick={handleClick('bottom-end')}
                />
                <Popper open={open} anchorEl={anchorEl} placement={placement} transition>
                    {({ TransitionProps }) => (
                        <Fade {...TransitionProps} timeout={350}>
                            <Paper sx={{ marginTop: 2 }}>
                                <Typography sx={{ p: 2 }}>The content of the Popper.</Typography>
                            </Paper>
                        </Fade>
                    )}
                </Popper>
            </Stack>
        </Wrapper>
    )
}

export default Header
