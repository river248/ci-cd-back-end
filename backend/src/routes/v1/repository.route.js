import express from 'express'
import { RepositoryController } from '~/controllers/repository.controller'

const router = express.Router()

router
    .post('/', RepositoryController.createNew)
    .put('/', RepositoryController.update)
    .get('/', RepositoryController.findAllRepositories)

export const RepositoryRoute = router
