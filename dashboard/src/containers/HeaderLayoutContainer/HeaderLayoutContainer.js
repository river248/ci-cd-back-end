import React, { useCallback, useMemo, useState } from 'react'
import LogoutIcon from '@mui/icons-material/Logout'
import { useTheme } from '@mui/material'

import Header from '~/layouts/components/Header'
import { useAuth } from '~/hooks'

function HeaderLayoutContainer() {
    const [popperAnchor, setPopperAnchor] = useState(null)
    const [openPopper, setOpenPopper] = useState(false)
    const [popperPlacement, setPopperPlacement] = useState()
    const { signout } = useAuth()

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

    return (
        <Header
            avatar={
                'https://congluan-cdn.congluan.vn/files/content/2022/05/26/doraemon-nobita-va-cuoc-chien-vu-tru-ti-hon-goi-tron-mua-he-trong-man-anh-183307801.jpg'
            }
            openPopper={openPopper}
            popperAnchor={popperAnchor}
            popperPlacement={popperPlacement}
            onTogglePopper={handleTogglePopper}
            popperMenu={popperMenu}
            onSelectItem={handleSelectedItem}
        />
    )
}

export default HeaderLayoutContainer
