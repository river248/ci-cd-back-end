import { HttpStatusCode } from '~/utils/constants'

class NotFound extends Error {
    constructor(message) {
        super(message)

        Error.captureStackTrace(this, this.constructor)

        this.name = this.constructor.name
        this.status = HttpStatusCode.NOT_FOUND
    }

    statusCode() {
        return this.status
    }
}

export default NotFound
