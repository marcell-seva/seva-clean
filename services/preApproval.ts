import { AxiosRequestConfig } from 'axios'
import endpoints from '../helpers/endpoints'
import { API } from '../utils/api'

export const checkPromoCodeGias = (
  promoCode: string,
  config?: AxiosRequestConfig,
) => {
  return API.post(
    endpoints.checkPromoCodeGias,
    {
      promoCode,
    },
    config,
  )
}
