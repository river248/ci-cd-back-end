import express from 'express'

import { PipeLineController } from '~/controllers/pipeline.controller'
import { PipelineValidation } from '~/validations/pipeline.validation'

const router = express.Router()

/**
 * This route is used for getting realtime data from github actions
 */
router.post('/data', PipeLineController.getWorkflowDataFromGithub)

router.post('/trigger-pipeline', PipelineValidation.triggerPipeline, PipeLineController.triggerPipeline)
router.get('/:repository', PipeLineController.getFullPipeline)

export const PipeLineRoute = router
