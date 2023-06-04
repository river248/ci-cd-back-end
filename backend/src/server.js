import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { Octokit } from 'octokit'
// import { credential } from 'firebase-admin'
// import { initializeApp } from 'firebase-admin/app'

import { env } from './configs/environment'
import { connectDB } from './configs/mongodb'
import { apiV1 } from './routes/v1'
import SocketServices from './services/socket.service'
import { corsConfig } from './configs/cors'
// import { firebaseCredentials } from './config/firebase'

connectDB()
    .then(() => console.log('Connected successfully to database server!'))
    .then(() => bootServer())
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

const bootServer = async () => {
    const app = express()
    const httpServer = createServer(app)

    const io = new Server(httpServer, {
        cors: corsConfig,
    })
    const socketService = new SocketServices()

    const octokit = new Octokit({
        auth: env.GITHUB_AUTH,
    })

    global._io = io
    global._octokit = octokit

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cors(corsConfig))

    // initializeApp({
    //     credential: credential.cert(firebaseCredentials),
    // })

    app.use('/v1', apiV1)

    _io.on('connection', socketService.connection)

    httpServer.listen(8080, () => {
        console.log(`Hello CI/CD App, I'm running at :${8080}/`)
    })
}
