import express from 'express'
import {
  createBlog,
  createPartner,
  createTestimonial,
  deleteBlog,
  deletePartner,
  deleteTestimonial,
  getBlogBySlug,
  getBlogs,
  getPartners,
  getTestimonials,
  updateBlog,
  updatePartner,
  updateTestimonial,
} from '../controller/content.js'
import { restrictTo, verifyToken } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/partners', getPartners)
router.get('/testimonials', getTestimonials)
router.get('/blogs', getBlogs)
router.get('/blogs/:slug', getBlogBySlug)

router.use('/admin', verifyToken, restrictTo('admin'))

router.post('/admin/partners', createPartner)
router.put('/admin/partners/:id', updatePartner)
router.delete('/admin/partners/:id', deletePartner)

router.post('/admin/testimonials', createTestimonial)
router.put('/admin/testimonials/:id', updateTestimonial)
router.delete('/admin/testimonials/:id', deleteTestimonial)

router.post('/admin/blogs', createBlog)
router.put('/admin/blogs/:id', updateBlog)
router.delete('/admin/blogs/:id', deleteBlog)

export default router
