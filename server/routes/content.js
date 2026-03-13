import express from 'express'
import {
  createPartner,
  createTestimonial,
  deletePartner,
  deleteTestimonial,
  getPartners,
  getTestimonials,
  updatePartner,
  updateTestimonial,
} from '../controller/content.js'
import { restrictTo, verifyToken } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/partners', getPartners)
router.get('/testimonials', getTestimonials)

router.use('/admin', verifyToken, restrictTo('admin'))

router.post('/admin/partners', createPartner)
router.put('/admin/partners/:id', updatePartner)
router.delete('/admin/partners/:id', deletePartner)

router.post('/admin/testimonials', createTestimonial)
router.put('/admin/testimonials/:id', updateTestimonial)
router.delete('/admin/testimonials/:id', deleteTestimonial)

export default router
