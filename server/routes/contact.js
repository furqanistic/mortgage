import express from 'express'
import { submitConsultationRequest } from '../controller/contact.js'

const router = express.Router()

router.post('/consultation', submitConsultationRequest)

export default router
