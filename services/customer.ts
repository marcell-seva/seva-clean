import endpoints from 'helpers/endpoints'
import { API } from '../utils/api'

export const getCustomerInfoSeva = () => {
  return API.get(endpoints.customersInfo)
}
