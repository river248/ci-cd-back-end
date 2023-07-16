import { HttpStatusCode } from '~/utils/constants'

class BadRequest extends Error {
    constructor(message) {
        super(message)

        Error.captureStackTrace(this, this.constructor)

        this.name = this.constructor.name
        this.status = HttpStatusCode.BAD_REQUEST
    }

    statusCode() {
        return this.status
    }
}

export default BadRequest
