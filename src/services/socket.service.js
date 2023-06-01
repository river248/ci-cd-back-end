import { socketEvent } from '~/utils/constants'

class SocketServices {
    connection(socket) {
        socket.on(socketEvent.USING_PIPELINE, (pipeline) => {
            console.log(socketEvent.USING_PIPELINE, pipeline)
            socket.join(pipeline)
        })

        socket.on('disconnect', () => {
            console.log(`User disconnect id is ${socket.id}`)
        })
    }
}

export default SocketServices
