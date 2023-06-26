import axios from 'axios'
import endpoints from 'helpers/endpoints'

export const getCities = () => {
  return axios.get(endpoints.cities)
}

export const getEventActive = () => {
  return axios.get(endpoints.eventActive)
}
