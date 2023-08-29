import { AxiosRequestConfig } from 'axios'
import { api } from 'services/api'

export const checkPromoCodeGias = (
  promoCode: string,
  config?: AxiosRequestConfig,
) => {
  return api.postCheckPromoGiias(promoCode)
}
