import React from 'react'
import PropTypes from 'prop-types'
import AllInclusiveIcon from '@mui/icons-material/AllInclusive'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import ClickAwayListener from '@mui/base/ClickAwayListener'
import Fade from '@mui/material/Fade'
import Popper from '@mui/material/Popper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { isEmpty } from 'lodash'

import { Dropdown, DropdownItem, Search, Wrapper } from './Header.styles'
import Button from '~/components/Button'

function Header({
    avatar,
    popperPlacement,
    popperAnchor,
    openPopper,
    popperMenu = [],
    navigation,
    onTogglePopper,
    onSelectItem,
    onNavigate,
}) {
    const theme = useTheme()

    return (
        <Wrapper>
            <Stack height={60} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Stack direction={'row'} alignItems={'center'}>
                    <AllInclusiveIcon
                        sx={{ color: theme.palette.common.white, fontSize: 35, marginRight: theme.spacing(1) }}
                    />
                    <Typography
                        variant={'h1'}
                        component={'span'}
                        fontWeight={600}
                        fontSize={24}
                        color={theme.palette.common.white}
                    >
                        CI/CD
                    </Typography>
                    <Button
                        variant={'contained'}
                        size={'small'}
                        defaultText={false}
                        uppercase={false}
                        sx={{ marginLeft: theme.spacing(3) }}
                        onClick={onNavigate}
                    >
                        {navigation}
                    </Button>
                </Stack>
                <Search placeholder={'Search...'} />
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
                                                    onClick={() => onSelectItem(item.id)}
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
    navigation: PropTypes.string.isRequired,
    onTogglePopper: PropTypes.func,
    onSelectItem: PropTypes.func,
    onNavigate: PropTypes.func,
}

export default React.memo(Header)
