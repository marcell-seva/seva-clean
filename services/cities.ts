import axios from 'axios'
import endpoints from 'helpers/endpoints'
import { API } from 'utils/api'

export const getCities = () => {
  return API.get(endpoints.cities)
}

export const getEventActive = () => {
  return API.get(endpoints.eventActive)
}
