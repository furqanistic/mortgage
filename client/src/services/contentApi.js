import { axiosInstance } from '@/config'

const authHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const getPartners = async (admin = false) => {
  const { data } = await axiosInstance.get('/content/partners', {
    params: admin ? { admin: true } : undefined,
  })
  return data?.data?.partners || []
}

export const getTestimonials = async (admin = false) => {
  const { data } = await axiosInstance.get('/content/testimonials', {
    params: admin ? { admin: true } : undefined,
  })
  return data?.data?.testimonials || []
}

export const getBlogs = async (admin = false) => {
  const { data } = await axiosInstance.get('/content/blogs', {
    params: admin ? { admin: true } : undefined,
  })
  return data?.data?.blogs || []
}

export const getBlogBySlug = async (slug, admin = false) => {
  const { data } = await axiosInstance.get(`/content/blogs/${slug}`, {
    params: admin ? { admin: true } : undefined,
  })
  return data?.data?.blog
}

export const createPartner = async (payload) => {
  const { data } = await axiosInstance.post('/content/admin/partners', payload, {
    headers: authHeader(),
  })
  return data?.data?.partner
}

export const updatePartner = async (id, payload) => {
  const { data } = await axiosInstance.put(`/content/admin/partners/${id}`, payload, {
    headers: authHeader(),
  })
  return data?.data?.partner
}

export const deletePartner = async (id) => {
  await axiosInstance.delete(`/content/admin/partners/${id}`, {
    headers: authHeader(),
  })
}

export const createTestimonial = async (payload) => {
  const { data } = await axiosInstance.post('/content/admin/testimonials', payload, {
    headers: authHeader(),
  })
  return data?.data?.testimonial
}

export const updateTestimonial = async (id, payload) => {
  const { data } = await axiosInstance.put(`/content/admin/testimonials/${id}`, payload, {
    headers: authHeader(),
  })
  return data?.data?.testimonial
}

export const deleteTestimonial = async (id) => {
  await axiosInstance.delete(`/content/admin/testimonials/${id}`, {
    headers: authHeader(),
  })
}

export const createBlog = async (payload) => {
  const { data } = await axiosInstance.post('/content/admin/blogs', payload, {
    headers: authHeader(),
  })
  return data?.data?.blog
}

export const updateBlog = async (id, payload) => {
  const { data } = await axiosInstance.put(`/content/admin/blogs/${id}`, payload, {
    headers: authHeader(),
  })
  return data?.data?.blog
}

export const deleteBlog = async (id) => {
  await axiosInstance.delete(`/content/admin/blogs/${id}`, {
    headers: authHeader(),
  })
}
