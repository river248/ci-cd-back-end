import React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

import Repository from '~/components/Repository'
import { Title } from './Dashboard.styles'

function Dashboard() {
    return (
        <Box padding={1}>
            <Title>Repositories</Title>
            <Grid container spacing={2}>
                <Grid item xl={2} lg={2.4} md={3} sm={4} xs={6}>
                    <Repository
                        name={'ci-cd-github-actions'}
                        imageUrl={
                            'https://congluan-cdn.congluan.vn/files/content/2022/05/26/doraemon-nobita-va-cuoc-chien-vu-tru-ti-hon-goi-tron-mua-he-trong-man-anh-183307801.jpg'
                        }
                    />
                </Grid>
                <Grid item xl={2} lg={2.4} md={3} sm={4} xs={6}>
                    <Repository
                        name={'ci-cd-github-actions'}
                        imageUrl={
                            'https://congluan-cdn.congluan.vn/files/content/2022/05/26/doraemon-nobita-va-cuoc-chien-vu-tru-ti-hon-goi-tron-mua-he-trong-man-anh-183307801.jpg'
                        }
                    />
                </Grid>
                <Grid item xl={2} lg={2.4} md={3} sm={4} xs={6}>
                    <Repository
                        name={'ci-cd-github-actions'}
                        imageUrl={
                            'https://congluan-cdn.congluan.vn/files/content/2022/05/26/doraemon-nobita-va-cuoc-chien-vu-tru-ti-hon-goi-tron-mua-he-trong-man-anh-183307801.jpg'
                        }
                    />
                </Grid>
                <Grid item xl={2} lg={2.4} md={3} sm={4} xs={6}>
                    <Repository
                        name={'ci-cd-github-actions'}
                        imageUrl={
                            'https://congluan-cdn.congluan.vn/files/content/2022/05/26/doraemon-nobita-va-cuoc-chien-vu-tru-ti-hon-goi-tron-mua-he-trong-man-anh-183307801.jpg'
                        }
                    />
                </Grid>
                <Grid item xl={2} lg={2.4} md={3} sm={4} xs={6}>
                    <Repository
                        name={'ci-cd-github-actions'}
                        imageUrl={
                            'https://congluan-cdn.congluan.vn/files/content/2022/05/26/doraemon-nobita-va-cuoc-chien-vu-tru-ti-hon-goi-tron-mua-he-trong-man-anh-183307801.jpg'
                        }
                    />
                </Grid>
                <Grid item xl={2} lg={2.4} md={3} sm={4} xs={6}>
                    <Repository
                        name={'ci-cd-github-actions'}
                        imageUrl={
                            'https://congluan-cdn.congluan.vn/files/content/2022/05/26/doraemon-nobita-va-cuoc-chien-vu-tru-ti-hon-goi-tron-mua-he-trong-man-anh-183307801.jpg'
                        }
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

export default Dashboard
