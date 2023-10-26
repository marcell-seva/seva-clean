import { AxiosRequestConfig } from 'axios'
import { updateLeadFormCM } from 'utils/types/utils'
import { postUpdateLeadsCM } from './api'

export const updateLeadFormCMSEVA = (
  data: updateLeadFormCM,
  config?: AxiosRequestConfig,
) => {
  return postUpdateLeadsCM(data, {
    ...config,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
