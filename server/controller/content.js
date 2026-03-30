import { createError } from '../error.js'
import { defaultPartners, defaultTestimonials } from '../data/defaultContent.js'
import Blog from '../models/Blog.js'
import Partner from '../models/Partner.js'
import Testimonial from '../models/Testimonial.js'
import { deleteFromCloudinary, uploadBufferToCloudinary } from '../utils/cloudinary.js'

const sortByOrder = { displayOrder: 1, createdAt: 1 }
const sortBlogs = { displayOrder: 1, datePublished: -1, createdAt: -1 }

const normalizeSlug = (value = '') =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const toNumberOrDefault = (value, fallback) => {
  const parsed = Number(value)
  return Number.isNaN(parsed) ? fallback : parsed
}

const toBoolean = (value, fallback) => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true
    if (value.toLowerCase() === 'false') return false
  }
  return fallback
}

const buildPartnerPayload = (body = {}) => {
  const payload = { ...body }
  if (Object.prototype.hasOwnProperty.call(payload, 'email')) {
    payload.email = String(payload.email || '')
      .trim()
      .toLowerCase()
  }
  if (Object.prototype.hasOwnProperty.call(payload, 'phone')) {
    payload.phone = String(payload.phone || '').trim()
  }
  if (Object.prototype.hasOwnProperty.call(payload, 'rating')) {
    payload.rating = toNumberOrDefault(payload.rating, 4.8)
  }
  if (Object.prototype.hasOwnProperty.call(payload, 'reviews')) {
    payload.reviews = toNumberOrDefault(payload.reviews, 0)
  }
  if (Object.prototype.hasOwnProperty.call(payload, 'displayOrder')) {
    payload.displayOrder = toNumberOrDefault(payload.displayOrder, 0)
  }
  if (Object.prototype.hasOwnProperty.call(payload, 'featured')) {
    payload.featured = toBoolean(payload.featured, false)
  }
  if (Object.prototype.hasOwnProperty.call(payload, 'isActive')) {
    payload.isActive = toBoolean(payload.isActive, true)
  }
  return payload
}

const buildTestimonialPayload = (body = {}) => {
  const payload = { ...body }
  if (Object.prototype.hasOwnProperty.call(payload, 'rating')) {
    payload.rating = toNumberOrDefault(payload.rating, 5)
  }
  if (Object.prototype.hasOwnProperty.call(payload, 'displayOrder')) {
    payload.displayOrder = toNumberOrDefault(payload.displayOrder, 0)
  }
  if (Object.prototype.hasOwnProperty.call(payload, 'isActive')) {
    payload.isActive = toBoolean(payload.isActive, true)
  }
  return payload
}

const parseJsonField = (value, fallback = null) => {
  if (value === undefined || value === null || value === '') return fallback
  if (typeof value === 'object') return value
  if (typeof value !== 'string') return fallback
  try {
    return JSON.parse(value)
  } catch (error) {
    return fallback
  }
}

const buildBlogPayload = (body = {}) => {
  const payload = { ...body }

  if (Object.prototype.hasOwnProperty.call(payload, 'displayOrder')) {
    payload.displayOrder = toNumberOrDefault(payload.displayOrder, 0)
  }
  if (Object.prototype.hasOwnProperty.call(payload, 'isLive')) {
    payload.isLive = toBoolean(payload.isLive, false)
  }
  if (Object.prototype.hasOwnProperty.call(payload, 'structuredContent')) {
    payload.structuredContent = parseJsonField(payload.structuredContent, null)
  }
  if (Object.prototype.hasOwnProperty.call(payload, 'datePublished')) {
    payload.datePublished = payload.datePublished ? new Date(payload.datePublished) : null
  }
  if (Object.prototype.hasOwnProperty.call(payload, 'dateModified')) {
    payload.dateModified = payload.dateModified ? new Date(payload.dateModified) : new Date()
  }

  return payload
}

const getBlogUploadFile = (files = [], fieldName) =>
  (Array.isArray(files) ? files : []).find((file) => file.fieldname === fieldName)

const collectStructuredImagePublicIds = (structuredContent) => {
  if (!structuredContent || !Array.isArray(structuredContent.sections)) return []
  return structuredContent.sections
    .flatMap((section) => (Array.isArray(section?.images) ? section.images : []))
    .map((image) => String(image?.publicId || '').trim())
    .filter(Boolean)
}

const withUploadedSectionImages = async (structuredContent, files = []) => {
  if (!structuredContent || !Array.isArray(structuredContent.sections)) return structuredContent

  const nextStructuredContent = JSON.parse(JSON.stringify(structuredContent))
  const imageUploads = (Array.isArray(files) ? files : []).filter((file) => /^sectionImageFile_\d+_\d+$/.test(file.fieldname))

  for (const upload of imageUploads) {
    const match = upload.fieldname.match(/^sectionImageFile_(\d+)_(\d+)$/)
    if (!match) continue
    const sectionIndex = Number(match[1])
    const imageIndex = Number(match[2])
    const section = nextStructuredContent.sections?.[sectionIndex]
    const image = section?.images?.[imageIndex]
    if (!section || !Array.isArray(section.images) || !image) continue

    const uploaded = await uploadBufferToCloudinary(upload.buffer, 'baufiking/blogs/sections')
    image.url = uploaded.secure_url
    image.publicId = uploaded.public_id
  }

  return nextStructuredContent
}

export const getPartners = async (req, res, next) => {
  try {
    const existingCount = await Partner.countDocuments()
    if (existingCount === 0) {
      await Partner.insertMany(defaultPartners)
    }

    const query = req.query.admin === 'true' ? {} : { isActive: true }
    const partnersQuery = Partner.find(query).sort(sortByOrder)
    if (req.query.admin !== 'true') {
      partnersQuery.select('-email -phone')
    }
    const partners = await partnersQuery
    res.status(200).json({ status: 'success', data: { partners } })
  } catch (error) {
    next(error)
  }
}

export const createPartner = async (req, res, next) => {
  try {
    const payload = buildPartnerPayload(req.body)

    if (req.file?.buffer) {
      const uploaded = await uploadBufferToCloudinary(req.file.buffer)
      payload.logoUrl = uploaded.secure_url
      payload.logoPublicId = uploaded.public_id
    }

    if (!payload.logoUrl) {
      return next(createError(400, 'Logo image is required'))
    }

    const partner = await Partner.create(payload)
    res.status(201).json({ status: 'success', data: { partner } })
  } catch (error) {
    next(createError(400, error.message))
  }
}

export const updatePartner = async (req, res, next) => {
  try {
    const existingPartner = await Partner.findById(req.params.id)
    if (!existingPartner) {
      return next(createError(404, 'Partner not found'))
    }

    const payload = buildPartnerPayload(req.body)

    if (req.file?.buffer) {
      const uploaded = await uploadBufferToCloudinary(req.file.buffer)
      payload.logoUrl = uploaded.secure_url
      payload.logoPublicId = uploaded.public_id

      if (existingPartner.logoPublicId) {
        await deleteFromCloudinary(existingPartner.logoPublicId)
      }
    }

    const partner = await Partner.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({ status: 'success', data: { partner } })
  } catch (error) {
    next(createError(400, error.message))
  }
}

export const deletePartner = async (req, res, next) => {
  try {
    const partner = await Partner.findById(req.params.id)
    if (!partner) {
      return next(createError(404, 'Partner not found'))
    }

    if (partner.logoPublicId) {
      await deleteFromCloudinary(partner.logoPublicId)
    }

    await Partner.findByIdAndDelete(req.params.id)
    res.status(200).json({ status: 'success' })
  } catch (error) {
    next(error)
  }
}

export const getTestimonials = async (req, res, next) => {
  try {
    const existingCount = await Testimonial.countDocuments()
    if (existingCount === 0) {
      await Testimonial.insertMany(defaultTestimonials)
    }

    const query = req.query.admin === 'true' ? {} : { isActive: true }
    const testimonials = await Testimonial.find(query).sort(sortByOrder)
    res.status(200).json({ status: 'success', data: { testimonials } })
  } catch (error) {
    next(error)
  }
}

export const createTestimonial = async (req, res, next) => {
  try {
    const payload = buildTestimonialPayload(req.body)

    if (req.file?.buffer) {
      const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'baufiking/testimonials')
      payload.image = uploaded.secure_url
      payload.imagePublicId = uploaded.public_id
    }

    if (!payload.image) {
      return next(createError(400, 'Testimonial image is required'))
    }

    const testimonial = await Testimonial.create(payload)
    res.status(201).json({ status: 'success', data: { testimonial } })
  } catch (error) {
    next(createError(400, error.message))
  }
}

export const updateTestimonial = async (req, res, next) => {
  try {
    const existingTestimonial = await Testimonial.findById(req.params.id)
    if (!existingTestimonial) {
      return next(createError(404, 'Testimonial not found'))
    }

    const payload = buildTestimonialPayload(req.body)

    if (req.file?.buffer) {
      const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'baufiking/testimonials')
      payload.image = uploaded.secure_url
      payload.imagePublicId = uploaded.public_id

      if (existingTestimonial.imagePublicId) {
        await deleteFromCloudinary(existingTestimonial.imagePublicId)
      }
    }

    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({ status: 'success', data: { testimonial } })
  } catch (error) {
    next(createError(400, error.message))
  }
}

export const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id)
    if (!testimonial) {
      return next(createError(404, 'Testimonial not found'))
    }

    if (testimonial.imagePublicId) {
      await deleteFromCloudinary(testimonial.imagePublicId)
    }

    await Testimonial.findByIdAndDelete(req.params.id)
    res.status(200).json({ status: 'success' })
  } catch (error) {
    next(error)
  }
}

export const getBlogs = async (req, res, next) => {
  try {
    const query = req.query.admin === 'true' ? {} : { isLive: true }
    const blogs = await Blog.find(query).sort(sortBlogs)
    res.status(200).json({ status: 'success', data: { blogs } })
  } catch (error) {
    next(error)
  }
}

export const getBlogBySlug = async (req, res, next) => {
  try {
    const includeDraft = req.query.admin === 'true'
    const query = { slug: normalizeSlug(req.params.slug) }
    if (!includeDraft) query.isLive = true

    const blog = await Blog.findOne(query)
    if (!blog) {
      return next(createError(404, 'Blog post not found'))
    }

    res.status(200).json({ status: 'success', data: { blog } })
  } catch (error) {
    next(error)
  }
}

export const createBlog = async (req, res, next) => {
  try {
    const payload = buildBlogPayload(req.body)
    const files = Array.isArray(req.files) ? req.files : []
    payload.slug = normalizeSlug(payload.slug || payload.title)

    if (!payload.slug) {
      return next(createError(400, 'Slug is required'))
    }

    const existing = await Blog.findOne({ slug: payload.slug })
    if (existing) {
      return next(createError(400, 'A blog with this slug already exists'))
    }

    payload.structuredContent = await withUploadedSectionImages(payload.structuredContent, files)

    const coverUpload = getBlogUploadFile(files, 'coverImageFile')
    if (coverUpload?.buffer) {
      const uploaded = await uploadBufferToCloudinary(coverUpload.buffer, 'baufiking/blogs')
      payload.coverImage = uploaded.secure_url
      payload.coverImagePublicId = uploaded.public_id
    }

    const blog = await Blog.create(payload)
    res.status(201).json({ status: 'success', data: { blog } })
  } catch (error) {
    next(createError(400, error.message))
  }
}

export const updateBlog = async (req, res, next) => {
  try {
    const existingBlog = await Blog.findById(req.params.id)
    if (!existingBlog) {
      return next(createError(404, 'Blog post not found'))
    }

    const payload = buildBlogPayload(req.body)
    const files = Array.isArray(req.files) ? req.files : []
    const oldImagePublicIds = new Set(collectStructuredImagePublicIds(existingBlog.structuredContent))
    payload.structuredContent = await withUploadedSectionImages(payload.structuredContent, files)

    const coverUpload = getBlogUploadFile(files, 'coverImageFile')
    if (coverUpload?.buffer) {
      const uploaded = await uploadBufferToCloudinary(coverUpload.buffer, 'baufiking/blogs')
      payload.coverImage = uploaded.secure_url
      payload.coverImagePublicId = uploaded.public_id

      if (existingBlog.coverImagePublicId) {
        await deleteFromCloudinary(existingBlog.coverImagePublicId)
      }
    } else if (
      Object.prototype.hasOwnProperty.call(payload, 'coverImage') &&
      payload.coverImage &&
      payload.coverImage !== existingBlog.coverImage &&
      existingBlog.coverImagePublicId
    ) {
      await deleteFromCloudinary(existingBlog.coverImagePublicId)
      payload.coverImagePublicId = ''
    }

    if (payload.slug || payload.title) {
      payload.slug = normalizeSlug(payload.slug || payload.title)
      const duplicate = await Blog.findOne({ slug: payload.slug, _id: { $ne: req.params.id } })
      if (duplicate) {
        return next(createError(400, 'A blog with this slug already exists'))
      }
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'isLive') && payload.isLive === false) {
      payload.datePublished = null
    } else if (payload.isLive === true && !payload.datePublished) {
      payload.datePublished = new Date()
    }
    payload.dateModified = new Date()

    const newImagePublicIds = new Set(collectStructuredImagePublicIds(payload.structuredContent))
    for (const oldPublicId of oldImagePublicIds) {
      if (!newImagePublicIds.has(oldPublicId)) {
        await deleteFromCloudinary(oldPublicId)
      }
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({ status: 'success', data: { blog } })
  } catch (error) {
    next(createError(400, error.message))
  }
}

export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (!blog) {
      return next(createError(404, 'Blog post not found'))
    }

    if (blog.coverImagePublicId) {
      await deleteFromCloudinary(blog.coverImagePublicId)
    }
    for (const imagePublicId of collectStructuredImagePublicIds(blog.structuredContent)) {
      await deleteFromCloudinary(imagePublicId)
    }

    await Blog.findByIdAndDelete(req.params.id)
    res.status(200).json({ status: 'success' })
  } catch (error) {
    next(error)
  }
}
