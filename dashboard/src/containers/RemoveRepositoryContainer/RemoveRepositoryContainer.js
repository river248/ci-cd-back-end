import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { connect } from 'react-redux'

import { removeRepo } from '~/apis/repositoryAPI'
import RemoveRepository from '~/components/RemoveRepository'
import { handleRemoveRepository } from '~/redux/async-logics/repositoryLogic'

function RemoveRepositoryContainer({ name, removeRepository, onRemove }) {
    const [repoName, setRepoName] = useState('')
    const [loading, setLoading] = useState(false)

    const handleOnChange = useCallback((event) => {
        setRepoName(event.target.value)
    }, [])

    const handleRemove = useCallback(() => {
        const callApi = async () => {
            setLoading(true)
            const res = await removeRepo(name)
            if (!isEmpty(res)) {
                removeRepository(name)
                onRemove()
            }
            setLoading(false)
        }

        callApi()
    }, [name])

    return (
        <RemoveRepository
            name={name}
            disabled={isEmpty(repoName) || repoName !== name || loading}
            onChange={handleOnChange}
            onRemove={handleRemove}
            onClose={onRemove}
        />
    )
}

RemoveRepositoryContainer.propTypes = {
    name: PropTypes.string.isRequired,
    removeRepository: PropTypes.func,
    onRemove: PropTypes.func,
}

const mapDispatchToProps = (dispatch) => ({
    removeRepository: (name) => {
        dispatch(handleRemoveRepository(name))
    },
})

export default connect(null, mapDispatchToProps)(React.memo(RemoveRepositoryContainer))
