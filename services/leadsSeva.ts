import { AxiosRequestConfig } from 'axios'
import { postUpdateLeadsOTO } from './api'

interface inputData {
  leadId: string
  leadResponse: boolean
  isLeadQualified: boolean
  carVariantId: string
  carModelId: string
  cityId: number
  priceOtr: number
}

export const updateLeadFormOTO = (
  data: inputData,
  config?: AxiosRequestConfig,
) => {
  return postUpdateLeadsOTO(data, {
    ...config,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
