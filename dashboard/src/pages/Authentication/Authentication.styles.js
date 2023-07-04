import { styled } from '@mui/material/styles'

import Button from '~/components/Button'

export const LeftGlass = styled('div')(({ theme }) => ({
    position: 'absolute',
    left: -300,
    top: -80,
    width: 600,
    height: 350,
    backgroundColor: '#ffffff30',
    borderRadius: theme.shape.borderRadius,
    transform: 'rotate(60deg)',
    zIndex: -1,
}))

export const BottomGlass = styled(LeftGlass)(() => ({
    left: 400,
    top: 'unset',
    bottom: -180,
    transform: 'translateX(-50%) rotate(-30deg)',
}))

export const RightGlass = styled(LeftGlass)(() => ({
    right: -300,
    left: 'unset',
    top: '50%',
    backgroundColor: '#00000030',
    transform: 'translateY(-50%) rotate(60deg)',
}))

export const SignInWithGithub = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(to left, #096386, #00b7a8, #f0eec8)',
    boxShadow: theme.shadows[10],
}))
