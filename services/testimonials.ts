import endpoints from 'helpers/endpoints'
import { API } from '../utils/api'

export const getTestimonials = () => {
  return API.get(endpoints.testimonials)
}
