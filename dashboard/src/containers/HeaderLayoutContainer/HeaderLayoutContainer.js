import React, { useCallback, useMemo, useState } from 'react'
import LogoutIcon from '@mui/icons-material/Logout'
import { useTheme } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'

import Header from '~/layouts/components/Header'
import { useAuth } from '~/hooks'
import routes from '~/configs/routes'

function HeaderLayoutContainer() {
    const [popperAnchor, setPopperAnchor] = useState(null)
    const [openPopper, setOpenPopper] = useState(false)
    const [popperPlacement, setPopperPlacement] = useState()
    const { signout, user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const theme = useTheme()
    const popperMenu = useMemo(
        () => [
            {
                id: 'signout',
                name: 'Sign out',
                icon: <LogoutIcon sx={{ color: theme.palette.common.black }} />,
            },
        ],
        [],
    )
    const isExecutionPage = useMemo(() => location.pathname === routes.executions, [location.pathname])

    const handleTogglePopper = useCallback(
        (newPlacement, event) => {
            if (event) {
                setPopperAnchor(event.currentTarget)
                setOpenPopper((prev) => popperPlacement !== newPlacement || !prev)
            } else {
                setOpenPopper(false)
            }

            setPopperPlacement(newPlacement)
        },
        [popperPlacement],
    )

    const handleSelectedItem = useCallback((item) => {
        if (item === 'signout') {
            signout()
        }
    }, [])

    const handleNavigate = useCallback(() => {
        if (isExecutionPage) {
            navigate(routes.dashboard)
        } else {
            navigate(routes.executions)
        }
    }, [isExecutionPage])

    return (
        <Header
            avatar={user.avatar}
            openPopper={openPopper}
            popperAnchor={popperAnchor}
            popperPlacement={popperPlacement}
            popperMenu={popperMenu}
            navigation={isExecutionPage ? 'Dashboard' : 'Executions'}
            onTogglePopper={handleTogglePopper}
            onSelectItem={handleSelectedItem}
            onNavigate={handleNavigate}
        />
    )
}

export default HeaderLayoutContainer
