import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
// import { credential } from 'firebase-admin'
// import { initializeApp } from 'firebase-admin/app'

// import { env } from './config/environment'
// import { connectDB } from './config/mongodb'
import { apiV1 } from './routes/v1'
import SocketServices from './services/socket.service'
import { corsConfig } from './configs/cors'
// import { firebaseCredentials } from './config/firebase'

// connectDB()
//     .then(() => console.log('Connected successfully to database server!'))
//     .then(() => bootServer())
//     .catch((error) => {
//         console.error(error)
//         process.exit(1)
//     })

const bootServer = async () => {
    const app = express()
    const httpServer = createServer(app)
    const io = new Server(httpServer, {
        cors: corsConfig,
    })
    const socketService = new SocketServices()

    global._io = io
    global.datafile = 1

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cors(corsConfig))

    // initializeApp({
    //     credential: credential.cert(firebaseCredentials),
    // })

    app.use('/v1', apiV1)

    global._io.on('connection', socketService.connection)
    // Octokit.js
    // https://github.com/octokit/core.js#readme
    // const octokit = new Octokit({
    //     auth: 'YOUR-TOKEN',
    // })

    // await octokit.request('GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}', {
    //     owner: 'river248',
    //     repo: 'ci-cd-backend',
    //     workflow_id: 'CI/CD River Backend',
    //     headers: {
    //         'X-GitHub-Api-Version': '2022-11-28',
    //     },
    // })

    httpServer.listen(8080, () => {
        console.log(`Hello CI/CD App, I'm running at :${8080}/`)
    })
}

bootServer()
