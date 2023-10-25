import { AxiosRequestConfig } from 'axios'
import { api } from './api'
import { updateLeadFormCM } from 'utils/types/utils'

export const updateLeadFormCMSEVA = (
  data: updateLeadFormCM,
  config?: AxiosRequestConfig,
) => {
  return api.postUpdateLeadsCM(data, {
    ...config,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
