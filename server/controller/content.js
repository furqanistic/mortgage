import { createError } from '../error.js'
import { defaultPartners, defaultTestimonials } from '../data/defaultContent.js'
import Blog from '../models/Blog.js'
import Partner from '../models/Partner.js'
import Testimonial from '../models/Testimonial.js'

const sortByOrder = { displayOrder: 1, createdAt: 1 }
const sortBlogs = { displayOrder: 1, datePublished: -1, createdAt: -1 }

const normalizeSlug = (value = '') =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

export const getPartners = async (req, res, next) => {
  try {
    const existingCount = await Partner.countDocuments()
    if (existingCount === 0) {
      await Partner.insertMany(defaultPartners)
    }

    const query = req.query.admin === 'true' ? {} : { isActive: true }
    const partners = await Partner.find(query).sort(sortByOrder)
    res.status(200).json({ status: 'success', data: { partners } })
  } catch (error) {
    next(error)
  }
}

export const createPartner = async (req, res, next) => {
  try {
    const partner = await Partner.create(req.body)
    res.status(201).json({ status: 'success', data: { partner } })
  } catch (error) {
    next(createError(400, error.message))
  }
}

export const updatePartner = async (req, res, next) => {
  try {
    const partner = await Partner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!partner) {
      return next(createError(404, 'Partner not found'))
    }
    res.status(200).json({ status: 'success', data: { partner } })
  } catch (error) {
    next(createError(400, error.message))
  }
}

export const deletePartner = async (req, res, next) => {
  try {
    const partner = await Partner.findByIdAndDelete(req.params.id)
    if (!partner) {
      return next(createError(404, 'Partner not found'))
    }
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
    const testimonial = await Testimonial.create(req.body)
    res.status(201).json({ status: 'success', data: { testimonial } })
  } catch (error) {
    next(createError(400, error.message))
  }
}

export const updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!testimonial) {
      return next(createError(404, 'Testimonial not found'))
    }
    res.status(200).json({ status: 'success', data: { testimonial } })
  } catch (error) {
    next(createError(400, error.message))
  }
}

export const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id)
    if (!testimonial) {
      return next(createError(404, 'Testimonial not found'))
    }
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
    const payload = { ...req.body }
    payload.slug = normalizeSlug(payload.slug || payload.title)

    if (!payload.slug) {
      return next(createError(400, 'Slug is required'))
    }

    const existing = await Blog.findOne({ slug: payload.slug })
    if (existing) {
      return next(createError(400, 'A blog with this slug already exists'))
    }

    const blog = await Blog.create(payload)
    res.status(201).json({ status: 'success', data: { blog } })
  } catch (error) {
    next(createError(400, error.message))
  }
}

export const updateBlog = async (req, res, next) => {
  try {
    const payload = { ...req.body }
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

    const blog = await Blog.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    })

    if (!blog) {
      return next(createError(404, 'Blog post not found'))
    }

    res.status(200).json({ status: 'success', data: { blog } })
  } catch (error) {
    next(createError(400, error.message))
  }
}

export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id)
    if (!blog) {
      return next(createError(404, 'Blog post not found'))
    }
    res.status(200).json({ status: 'success' })
  } catch (error) {
    next(error)
  }
}
