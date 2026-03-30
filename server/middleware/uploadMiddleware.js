import multer from 'multer'

const storage = multer.memoryStorage()

const imageOnlyFilter = (req, file, cb) => {
  if (file.mimetype?.startsWith('image/')) {
    cb(null, true)
    return
  }
  const error = new Error('Only image files are allowed')
  error.status = 400
  cb(error)
}

const createUploader = (fieldName) =>
  multer({
    storage,
    fileFilter: imageOnlyFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
  }).single(fieldName)

const logoUpload = createUploader('logo')
const testimonialImageUpload = createUploader('imageFile')
const blogContentUpload = multer({
  storage,
  fileFilter: imageOnlyFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).any()

const handleUploadError = (error, next) => {
  if (!error) return next()
  if (error.code === 'LIMIT_FILE_SIZE') {
    error.status = 400
    error.message = 'Image size must be 5MB or less'
  } else if (!error.status) {
    error.status = 400
  }
  next(error)
}

export const uploadPartnerLogo = (req, res, next) => {
  logoUpload(req, res, (error) => handleUploadError(error, next))
}

export const uploadTestimonialImage = (req, res, next) => {
  testimonialImageUpload(req, res, (error) => handleUploadError(error, next))
}

export const uploadBlogCoverImage = (req, res, next) => {
  blogContentUpload(req, res, (error) => handleUploadError(error, next))
}
