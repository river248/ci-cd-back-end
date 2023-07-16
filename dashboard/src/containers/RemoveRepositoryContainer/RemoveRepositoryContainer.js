import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { connect } from 'react-redux'

import { removeRepo } from '~/apis/repositoryAPI'
import RemoveRepository from '~/components/RemoveRepository'
import { handleRemoveRepository } from '~/redux/async-logics/repositoryLogic'

function RemoveRepositoryContainer({ removedRepo, removeRepository, onRemove }) {
    const [repoName, setRepoName] = useState('')
    const [loading, setLoading] = useState(false)

    const { name, imageUrl } = removedRepo

    const handleOnChange = useCallback((event) => {
        setRepoName(event.target.value)
    }, [])

    const handleRemove = useCallback(() => {
        const callApi = async () => {
            setLoading(true)
            const res = await removeRepo(name, imageUrl)
            if (!isEmpty(res)) {
                removeRepository(name)
                onRemove()
            }
            setLoading(false)
        }

        callApi()
    }, [name, imageUrl])

    return (
        <RemoveRepository
            name={name}
            imageUrl={imageUrl}
            disabled={isEmpty(repoName) || repoName !== name || loading}
            onChange={handleOnChange}
            onRemove={handleRemove}
            onClose={onRemove}
        />
    )
}

RemoveRepositoryContainer.propTypes = {
    removedRepo: PropTypes.shape({
        name: PropTypes.string.isRequired,
        imageUrl: PropTypes.string.isRequired,
    }),
    removeRepository: PropTypes.func,
    onRemove: PropTypes.func,
}

const mapDispatchToProps = (dispatch) => ({
    removeRepository: (name) => {
        dispatch(handleRemoveRepository(name))
    },
})

export default connect(null, mapDispatchToProps)(React.memo(RemoveRepositoryContainer))
