import { axiosInstance } from '@/config'

export const submitConsultationRequest = async (payload) => {
  const { data } = await axiosInstance.post('/contact/consultation', payload)
  return data
}
