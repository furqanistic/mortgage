import mongoose from 'mongoose'

const TestimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, default: 'Home Buyer', trim: true },
    location: { type: String, default: '', trim: true },
    text: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model('Testimonial', TestimonialSchema)
