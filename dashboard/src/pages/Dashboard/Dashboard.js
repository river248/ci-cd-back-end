import React, { Fragment, useEffect } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { connect } from 'react-redux'
import { isEmpty, isNil } from 'lodash'

import Repository from '~/components/Repository'
import Title from '~/components/Title'
import { handleFetchAllRepositories } from '~/redux/async-logics/repositoryLogic'

function Dashboard({ loading, repositories, getAllRepositories }) {
    const fakeRepositories = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

    useEffect(() => {
        getAllRepositories()
    }, [])

    return (
        <Box padding={2}>
            <Title content={'Repositories'} />
            <Grid container spacing={2} marginTop={2}>
                {loading ? (
                    <Fragment>
                        {fakeRepositories.map((repo) => (
                            <Grid key={repo} item xl={2} lg={2.4} md={3} sm={4} xs={6}>
                                <Repository name={repo} loading />
                            </Grid>
                        ))}
                    </Fragment>
                ) : (
                    <Fragment>
                        {!isEmpty(repositories) &&
                            !isNil(repositories) &&
                            repositories.map((repository) => (
                                <Grid key={repository.name} item xl={2} lg={2.4} md={3} sm={4} xs={6}>
                                    <Repository
                                        name={repository.name}
                                        imageUrl={
                                            'https://congluan-cdn.congluan.vn/files/content/2022/05/26/doraemon-nobita-va-cuoc-chien-vu-tru-ti-hon-goi-tron-mua-he-trong-man-anh-183307801.jpg'
                                        }
                                    />
                                </Grid>
                            ))}
                    </Fragment>
                )}
            </Grid>
        </Box>
    )
}

const mapStateToProps = (state) => ({
    loading: state.repository.loading,
    repositories: state.repository.repositories,
})

const mapDispatchToProps = (dispatch) => ({
    getAllRepositories: () => {
        dispatch(handleFetchAllRepositories())
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
