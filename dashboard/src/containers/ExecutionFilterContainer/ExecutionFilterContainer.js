import React, { useState, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { format } from 'date-fns'
import { isEmpty } from 'lodash'
import { connect } from 'react-redux'

import ExecutionFilter from '~/components/ExecutionFilter'
import { handleGetExecutionsByDate } from '~/redux/async-logics/executionLogic'
import { handleFetchAllRepositories } from '~/redux/async-logics/repositoryLogic'

function ExecutionFilterContainer({ loading, repositories, getExecutionsByDate, getAllRepositories }) {
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [repository, setRepository] = useState('')

    const options = useMemo(() => {
        getAllRepositories()
        return repositories.map((repository) => repository.name)
    }, [JSON.stringify(repositories)])

    const disabled = useMemo(
        () => isEmpty(startDate) || isEmpty(endDate) || isEmpty(repository),
        [startDate, endDate, repository],
    )

    const handleDatePicker = useCallback((type, value) => {
        if (type === 'start') {
            setStartDate(format(value, 'yyyy-MM-dd'))
        } else {
            setEndDate(format(value, 'yyyy-MM-dd'))
        }
    }, [])

    const handleSelect = useCallback((event) => {
        setRepository(event.target.value)
    }, [])

    const handleSearch = useCallback(() => {
        getExecutionsByDate(repository, startDate, endDate)
    }, [startDate, endDate, repository])

    return (
        <ExecutionFilter
            options={options}
            selectedOption={repository}
            disabled={loading || disabled}
            onSelect={handleSelect}
            onDatePicker={handleDatePicker}
            onSearch={handleSearch}
        />
    )
}

ExecutionFilterContainer.propTypes = {
    loading: PropTypes.bool,
    repositories: PropTypes.array,
    getExecutionsByDate: PropTypes.func,
    getAllRepositories: PropTypes.func,
}

const mapStateToProps = (state) => ({
    loading: state.execution.loading,
    repositories: state.repository.repositories,
})

const mapDispatchToProps = (dispatch) => ({
    getExecutionsByDate: (repository, startDateTime, endDateTime) => {
        dispatch(handleGetExecutionsByDate(repository, startDateTime, endDateTime))
    },
    getAllRepositories: () => {
        dispatch(handleFetchAllRepositories())
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(ExecutionFilterContainer))
