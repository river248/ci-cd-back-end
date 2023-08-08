import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { DataGrid } from '@mui/x-data-grid/DataGrid'
import { format } from 'date-fns'
import { connect } from 'react-redux'

import { differenceInTime } from '~/utils/helper'
import StatusIcon from '~/components/StatusIcon'
import { EXECUTION } from '~/utils/apiPropTypes'

function ExecutionTableContainer({ executions }) {
    const columns = useMemo(
        () => [
            { field: 'repository', headerName: 'Repository', width: 200 },
            { field: 'version', headerName: 'Version', width: 130 },
            { field: 'stage', headerName: 'Stage', width: 110 },
            { field: 'branch', headerName: 'Branch', width: 230 },
            {
                field: 'status',
                headerName: 'Status',
                width: 100,
                renderCell: (params) => <StatusIcon status={params.value} />,
            },
            { field: 'startTime', headerName: 'State time', width: 150 },
            { field: 'duration', headerName: 'Duration', width: 100 },
        ],
        [],
    )

    const rows = useMemo(
        () =>
            executions.map((execution) => {
                const { _id, repository, version, name, codePipelineBranch, status, startDateTime, endDateTime } =
                    execution
                return {
                    id: _id,
                    repository,
                    version,
                    stage: name,
                    branch: codePipelineBranch,
                    status,
                    startTime: format(new Date(startDateTime), 'dd/MM/yyyy HH:mm'),
                    duration: differenceInTime(startDateTime, endDateTime),
                }
            }),
        [JSON.stringify(executions)],
    )

    return (
        <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
                pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                },
            }}
            pageSizeOptions={[10]}
        />
    )
}

ExecutionTableContainer.propTypes = {
    executions: PropTypes.arrayOf(EXECUTION),
}

const mapStateToProps = (state) => ({
    executions: state.execution.executions,
})

export default connect(mapStateToProps, null)(React.memo(ExecutionTableContainer))
