import React from 'react'
import PropTypes from 'prop-types'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import ClickAwayListener from '@mui/base/ClickAwayListener'
import Fade from '@mui/material/Fade'
import Popper from '@mui/material/Popper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { isEmpty } from 'lodash'

import { Dropdown, DropdownItem, Search, Wrapper } from './Header.styles.js'

function Header({ avatar, popperPlacement, popperAnchor, openPopper, popperMenu = [], hasSearch, onTogglePopper }) {
    const theme = useTheme()

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
                {hasSearch && <Search size={'small'} placeholder={'Search...'} />}
                <ClickAwayListener onClickAway={() => onTogglePopper('bottom-end', null)}>
                    <Box>
                        <Avatar
                            alt={'Avatar'}
                            src={avatar}
                            sx={{ width: 40, height: 40, cursor: 'pointer' }}
                            onClick={(event) => onTogglePopper('bottom-end', event)}
                        />
                        {!isEmpty(popperMenu) && (
                            <Popper open={openPopper} anchorEl={popperAnchor} placement={popperPlacement} transition>
                                {({ TransitionProps }) => (
                                    <Fade {...TransitionProps} timeout={100}>
                                        <Dropdown>
                                            {popperMenu.map((item) => (
                                                <DropdownItem
                                                    key={item.id}
                                                    uppercase={false}
                                                    italic={true}
                                                    startIcon={item.icon}
                                                >
                                                    {item.name}
                                                </DropdownItem>
                                            ))}
                                        </Dropdown>
                                    </Fade>
                                )}
                            </Popper>
                        )}
                    </Box>
                </ClickAwayListener>
            </Stack>
        </Wrapper>
    )
}

Header.propTypes = {
    avatar: PropTypes.string,
    popperPlacement: PropTypes.string,
    popperAnchor: PropTypes.object,
    openPopper: PropTypes.bool,
    popperMenu: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            icon: PropTypes.node.isRequired,
            name: PropTypes.string.isRequired,
        }),
    ),
    hasSearch: PropTypes.bool,
    onTogglePopper: PropTypes.func,
}

export default React.memo(Header)
