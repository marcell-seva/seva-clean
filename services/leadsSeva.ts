import { AxiosRequestConfig } from 'axios'
import { api } from 'services/api'

interface inputData {
  leadId: string
  leadResponse: boolean
  isLeadQualified: boolean
  carVariantId: string
  carModelId: string
  cityId: number
  priceOtr: number
}

export const getLeadsDetail = (id: string) => {
  return api.getLeadsDetail(id)
}

export const updateLeadFormOTO = (
  data: inputData,
  config?: AxiosRequestConfig,
) => {
  return api.postUpdateLeadsOTO(data, {
    ...config,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
