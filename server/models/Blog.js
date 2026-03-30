import mongoose from 'mongoose'

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true, lowercase: true },
    excerpt: { type: String, default: '', trim: true },
    category: { type: String, default: '', trim: true },
    coverImage: { type: String, default: '', trim: true },
    coverImagePublicId: { type: String, default: '', trim: true },
    readTime: { type: String, default: '', trim: true },
    contentHtml: { type: String, required: true },
    structuredContent: { type: mongoose.Schema.Types.Mixed, default: null },
    isLive: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    datePublished: { type: Date, default: null },
    dateModified: { type: Date, default: Date.now },
    authorName: { type: String, default: '', trim: true },
  },
  { timestamps: true }
)

BlogSchema.pre('save', function updateBlogDates(next) {
  this.dateModified = new Date()
  if (this.isLive && !this.datePublished) {
    this.datePublished = new Date()
  }
  if (!this.isLive) {
    this.datePublished = null
  }
  next()
})

export default mongoose.model('Blog', BlogSchema)
