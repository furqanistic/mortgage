import mongoose from 'mongoose'

const PartnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['finance', 'brokers', 'legal', 'inspection'],
      default: 'finance',
    },
    description: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true, lowercase: true },
    phone: { type: String, default: '', trim: true },
    logoUrl: { type: String, required: true, trim: true },
    logoPublicId: { type: String, default: '', trim: true },
    rating: { type: Number, min: 0, max: 5, default: 4.8 },
    reviews: { type: Number, min: 0, default: 0 },
    featured: { type: Boolean, default: false },
    location: { type: String, default: 'Nationwide', trim: true },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model('Partner', PartnerSchema)
