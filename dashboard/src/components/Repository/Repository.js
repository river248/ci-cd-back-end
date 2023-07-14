import React from 'react'
import PropTypes from 'prop-types'
import AllInclusiveIcon from '@mui/icons-material/AllInclusive'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'

import { CardContent, CardActions, CardOverflow, AspectRatio } from './Repository.styles'
import routes from '~/configs/routes'
import Button from '~/components/Button'
import { useFirebaseImage } from '~/hooks'

function Repository({ name, imageUrl, loading, newItem, onAddNew }) {
    const navigate = useNavigate()
    const theme = useTheme()
    const thumbnail = useFirebaseImage(imageUrl)

    const handleGoToPipeline = (event) => {
        event.preventDefault()
        navigate(`${routes.pipeline}?repo=${name}`)
    }

    if (loading) {
        return (
            <Paper sx={{ paddingBottom: 1 }}>
                <Skeleton variant={'rectangular'} height={140} />
                <Skeleton variant={'text'} sx={{ marginLeft: 1, marginRight: 1, fontSize: '2rem' }} />
                <Stack marginX={1} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                    <Skeleton variant={'text'} sx={{ marginRight: 1, fontSize: '1rem', flexBasis: '50%' }} />
                    <Skeleton variant={'circular'} width={35} height={35} />
                </Stack>
            </Paper>
        )
    }

    return (
        <Card>
            {newItem ? (
                <CardOverflow>
                    <AspectRatio alignItems={'center'} justifyContent={'center'}>
                        <AllInclusiveIcon sx={{ color: theme.palette.secondary.dark, fontSize: '4rem' }} />
                    </AspectRatio>
                </CardOverflow>
            ) : (
                <CardMedia sx={{ height: 140 }} image={thumbnail} title={name} />
            )}
            <CardContent sx={{ textAlign: newItem ? 'center' : 'left' }}>
                {newItem ? (
                    <Button
                        defaultText={false}
                        uppercase={false}
                        sx={{
                            backgroundColor: theme.palette.secondary.dark,
                            ':hover': { backgroundColor: theme.palette.secondary.dark },
                        }}
                        onClick={onAddNew}
                    >
                        Add new repository
                    </Button>
                ) : (
                    <Tooltip arrow title={name}>
                        <Typography variant={'h5'} component={'div'} fontSize={20} noWrap>
                            {name}
                        </Typography>
                    </Tooltip>
                )}
            </CardContent>
            {!newItem && (
                <CardActions>
                    <Link href={`${routes.pipeline}?repo=${name}`} fontSize={15} onClick={handleGoToPipeline}>
                        Go to pipeline
                    </Link>
                    <Tooltip arrow title={'Delete'}>
                        <IconButton>
                            <DeleteIcon sx={{ color: 'red' }} />
                        </IconButton>
                    </Tooltip>
                </CardActions>
            )}
        </Card>
    )
}

Repository.propTypes = {
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    loading: PropTypes.bool,
    newItem: PropTypes.bool,
    onAddNew: PropTypes.func,
}

export default React.memo(Repository)
