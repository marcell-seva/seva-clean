import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { api } from 'services/api'
import { encryptValue } from 'utils/encryptionUtils'
import { LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { saveLocalStorage } from 'utils/handler/localStorage'
import { removeInformationWhenLogout } from 'utils/logoutUtils'
import { saveSessionStorage } from 'utils/handler/sessionStorage'
import { getToken } from 'utils/handler/auth'
import {
  CustomerKtpSeva,
  DeleteAccountRequestType,
  UpdateProfileType,
} from 'utils/types/utils'
import { setAmplitudeUserId } from 'services/amplitude'

export const getCustomerInfoSeva = () => {
  return api.getUserInfo()
}

export const getCustomerInfoWrapperSeva = () => {
  return getCustomerInfoSeva()
    .then((response) => {
      const customerId = response[0].id ?? ''
      const customerName = response[0].fullName ?? ''
      setAmplitudeUserId(response[0].phoneNumber ?? '')
      saveLocalStorage(
        LocalStorageKey.CustomerId,
        encryptValue(customerId.toString()),
      )
      saveLocalStorage(LocalStorageKey.CustomerName, encryptValue(customerName))
      saveSessionStorage(
        SessionStorageKey.CustomerId,
        encryptValue(customerId.toString()),
      )
      return response
    })
    .catch((err: any) => {
      if (err?.response?.status === 404) {
        removeInformationWhenLogout()
      }
    })
}

export const getCustomerKtpSeva = () => {
  return api.getCustomerKtpSeva({
    headers: {
      Authorization: getToken()?.idToken,
    },
  })
}

export const getCustomerSpouseKtpSeva = () => {
  return api.getCustomerSpouseKtpSeva({
    headers: {
      Authorization: getToken()?.idToken,
    },
  })
}

export const checkReferralCode = (
  refcode: string,
  phoneNumber: string,
): Promise<
  AxiosResponse<{
    data: any
  }>
> => {
  return api.postCheckReferralCode(
    {
      refcode,
      phoneNumber,
    },
    {
      headers: {
        Authorization: getToken()?.idToken,
      },
    },
  )
}

export const checkNIKAvailable = (nik: string) => {
  const params = new URLSearchParams()
  params.append('nik', nik)
  return api.getAvailableNIK({ params })
}

export const saveKtp = (data: CustomerKtpSeva, config?: AxiosRequestConfig) => {
  return api.postSaveKtp(
    { ...data },
    { ...config, headers: { Authorization: getToken()?.idToken } },
  )
}

export const saveKtpSpouse = (
  data: CustomerKtpSeva,
  config?: AxiosRequestConfig,
) => {
  return api.postSaveKtpSpouse(
    { spouseKtpObj: { ...data }, isSpouse: true },
    { ...config, headers: { Authorization: getToken()?.idToken } },
  )
}

export const deleteAccount = (
  payload: DeleteAccountRequestType,
  config?: AxiosRequestConfig,
) => {
  return api.postDeleteAccount(
    {
      phoneNumber: payload.phoneNumber,
      createdBy: payload.reason,
    },
    { ...config, headers: { Authorization: getToken()?.idToken } },
  )
}

export const updateProfile = (
  data: UpdateProfileType,
  config?: AxiosRequestConfig,
) => {
  return api.postUpdateProfile(data, {
    ...config,
    headers: { Authorization: getToken()?.idToken },
  })
}
