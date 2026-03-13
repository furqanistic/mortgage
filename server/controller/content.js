import { createError } from '../error.js'
import { defaultPartners, defaultTestimonials } from '../data/defaultContent.js'
import Partner from '../models/Partner.js'
import Testimonial from '../models/Testimonial.js'

const sortByOrder = { displayOrder: 1, createdAt: 1 }

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
