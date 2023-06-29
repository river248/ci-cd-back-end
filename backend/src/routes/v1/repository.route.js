import express from 'express'

import { RepositoryController } from '~/controllers/repository.controller'
import { RepositoryValidation } from '~/validations/repository.validation'

const router = express.Router()

router
    .post('/', RepositoryValidation.createNew, RepositoryController.createNew)
    .put('/', RepositoryValidation.update, RepositoryController.update)
    .get('/', RepositoryController.findAllRepositories)

export const RepositoryRoute = router
