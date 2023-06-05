import express from 'express'
import { PipeLineController } from '~/controllers/pipeline.controller'

const router = express.Router()

/**
 * This route is used for getting realtime data from github actions
 */
router.post('/data', PipeLineController.getWorkflowDataFromGithub)

router.post('/trigger-pipeline', PipeLineController.triggerPipeline)
router.get('/:repository', PipeLineController.getFullPipeline)

export const PipeLineRoute = router
