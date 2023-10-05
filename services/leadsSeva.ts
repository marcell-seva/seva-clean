import { AxiosRequestConfig } from 'axios'
import { api } from 'services/api'

export const getLeadsDetail = (id: string) => {
  return api.getLeadsDetail(id)
}

export const updateLeadFormOTO = ({
  data,
  ...restProps
}: AxiosRequestConfig) => {
  return api.postUploadKTPFile(data, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...restProps,
  })
}
