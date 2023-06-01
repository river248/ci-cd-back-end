import express from 'express'
import { PipeLineController } from '~/controllers/pipeline.controller'

const router = express.Router()

/**
 * This route is used for getting data from github actions
 */
router.get('/trigger-workflow', PipeLineController.triggerWorkflow)
router.post('/data', PipeLineController.handleDataFromGithubAction)

export const PipeLineRoute = router
