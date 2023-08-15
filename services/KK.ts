import { api } from 'services/api'
import { AxiosRequestConfig } from 'axios'
import endpoints from 'helpers/endpoints'
import { API } from 'utils/api'
import { getToken } from 'utils/handler/auth'
import {
  SendInstantApproval,
  SendKualifikasiKreditRequest,
  SendMultiKualifikasiKredit,
} from 'utils/types/utils'

export const sendKualifikasiKredit = (
  data: SendKualifikasiKreditRequest,
  config?: AxiosRequestConfig,
) => {
  return api.postCreditQualification(
    { ...data },
    { ...config, headers: { Authorization: getToken()?.idToken } },
  )
}

export const sendInstantApproval = (
  data: SendInstantApproval,
  config?: AxiosRequestConfig,
) => {
  return api.postInstantApproval(
    { ...data },
    { ...config, headers: { Authorization: getToken()?.idToken } },
  )
}

export const sendMultiKualifikasiKredit = (
  data: SendMultiKualifikasiKredit,
  config?: AxiosRequestConfig,
) => {
  return api.postMultiCreditQualification(
    { ...data },
    { ...config, headers: { Authorization: getToken()?.idToken } },
  )
}
