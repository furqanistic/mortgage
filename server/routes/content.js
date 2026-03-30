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
import { uploadBlogCoverImage, uploadPartnerLogo, uploadTestimonialImage } from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.get('/partners', getPartners)
router.get('/testimonials', getTestimonials)
router.get('/blogs', getBlogs)
router.get('/blogs/:slug', getBlogBySlug)

router.use('/admin', verifyToken, restrictTo('admin'))

router.post('/admin/partners', uploadPartnerLogo, createPartner)
router.put('/admin/partners/:id', uploadPartnerLogo, updatePartner)
router.delete('/admin/partners/:id', deletePartner)

router.post('/admin/testimonials', uploadTestimonialImage, createTestimonial)
router.put('/admin/testimonials/:id', uploadTestimonialImage, updateTestimonial)
router.delete('/admin/testimonials/:id', deleteTestimonial)

router.post('/admin/blogs', uploadBlogCoverImage, createBlog)
router.put('/admin/blogs/:id', uploadBlogCoverImage, updateBlog)
router.delete('/admin/blogs/:id', deleteBlog)

export default router
