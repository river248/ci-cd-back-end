import express from 'express'

import { PipeLineRoute } from './pipeline.route'

const router = express.Router()

router.get('/status', (_req, res) => res.status(200).json({ status: 'OK' }))
router.use('/pipeline', PipeLineRoute)

export const apiV1 = router
