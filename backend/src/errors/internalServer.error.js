import { HttpStatusCode } from '~/utils/constants'

class InternalServer extends Error {
    constructor(message) {
        super(message)

        Error.captureStackTrace(this, this.constructor)

        this.name = this.constructor.name
        this.status = HttpStatusCode.INTERNAL_SERVER
    }

    statusCode() {
        return this.status
    }
}

export default InternalServer
