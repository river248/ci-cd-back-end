import React from 'react'
import PropTypes from 'prop-types'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

import { CardContent, CardActions } from './Repository.styles'
import routes from '~/configs/routes'

function Repository({ name, imageUrl }) {
    const navigate = useNavigate()

    const handleGoToPipeline = (event) => {
        event.preventDefault()
        navigate(`${routes.pipeline}?repo=${name}`)
    }

    return (
        <Card>
            <CardMedia sx={{ height: 140 }} image={imageUrl} title={name} />
            <CardContent>
                <Tooltip arrow title={name}>
                    <Typography variant={'h5'} component={'div'} fontSize={20} noWrap>
                        {name}
                    </Typography>
                </Tooltip>
            </CardContent>
            <CardActions>
                <Link href={`${routes.pipeline}?repo=${name}`} fontSize={15} onClick={handleGoToPipeline}>
                    Go to pipeline
                </Link>
                <Tooltip arrow title={'Delete'}>
                    <IconButton>
                        <DeleteIcon style={{ color: 'red' }} color={'red'} />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    )
}

Repository.propTypes = {
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
}

export default React.memo(Repository)
