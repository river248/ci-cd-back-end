import { differenceInSeconds } from 'date-fns'

import { httpStatusCode } from './constants'

const beautifySecond = (timeDiff) => {
    let duration = ''

    const seconds = timeDiff % 60
    timeDiff = (timeDiff - seconds) / 60
    const minutes = timeDiff % 60
    timeDiff = (timeDiff - minutes) / 60
    const hours = timeDiff

    hours ? (duration = duration + `${hours}h `) : (duration = duration + '')
    minutes ? (duration = duration + `${minutes}m `) : (duration = duration + '')
    seconds ? (duration = duration + `${seconds}s`) : (duration = duration + '')
    return duration
}

export const differenceInTime = (startDateTime, endDateTime) => {
    const startDate = new Date(startDateTime)
    const endDate = new Date(endDateTime)

    const timeDiff = differenceInSeconds(endDate, startDate)

    return beautifySecond(timeDiff)
}

export const resExceptionMessageHandler = (exception) => {
    if (exception.response) {
        switch (exception.response.status) {
            case httpStatusCode.FORBIDDEN:
            case httpStatusCode.UNAUTHORIZED:
                return exception.response.data?.error || `User is not authorized to perform this action`
            case httpStatusCode.NOT_FOUND:
                return exception.response.data?.error || `Not Found`
            case httpStatusCode.BAD_REQUEST:
                return exception.response.data?.error || `Bad Request or wrong params`
            case httpStatusCode.INTERNAL_SERVER:
                return exception.response.data?.error || `Error code: 500 without message`
            default:
                return 'Unhandled status code'
        }
    }
    return 'Unhandled exception'
}
