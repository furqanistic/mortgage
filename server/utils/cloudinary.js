import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
})

export const uploadBufferToCloudinary = (buffer, folder = 'baufiking/partners') =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }
    )
    uploadStream.end(buffer)
  })

export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return null
  return cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
}

export default cloudinary
