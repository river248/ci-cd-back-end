import express from 'express'

const router = express.Router()

router.get('/status', (_req, res) => res.status(200).json({ status: 'OK' }))

export const apiV1 = router
