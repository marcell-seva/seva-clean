import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import {
  getAvailableNIK,
  getUserInfo,
  postCheckReferralCode,
  postDeleteAccount,
  postSaveKtp,
  postSaveKtpSpouse,
  postUpdateProfile,
  getCustomerKtpSeva as gcks,
  getCustomerSpouseKtpSeva as gcsks,
  putUpdateKtpCity,
} from 'services/api'
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
  updateKtpCityPayloadType,
} from 'utils/types/utils'
import { setAmplitudeUserId } from 'services/amplitude'

export const getCustomerInfoSeva = (isUsingTempToken?: boolean) => {
  return getUserInfo(isUsingTempToken)
}

export const getCustomerInfoWrapperSeva = async (
  isUsingTempToken?: boolean,
) => {
  try {
    const response = await getCustomerInfoSeva(isUsingTempToken)
    const customerId = response[0].id ?? ''
    const customerName = response[0].fullName ?? ''
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
  } catch (err: any) {
    if (err?.response?.status === 400) {
      removeInformationWhenLogout()
    }
  }
}

export const getCustomerKtpSeva = () => {
  return gcks({
    headers: {
      Authorization: getToken()?.idToken,
    },
  })
}

export const getCustomerSpouseKtpSeva = () => {
  return gcsks({
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
  return postCheckReferralCode(
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
  return getAvailableNIK({ params })
}

export const saveKtp = (data: CustomerKtpSeva, config?: AxiosRequestConfig) => {
  return postSaveKtp(
    { ...data },
    { ...config, headers: { Authorization: getToken()?.idToken } },
  )
}

export const saveKtpSpouse = (
  data: CustomerKtpSeva,
  config?: AxiosRequestConfig,
) => {
  return postSaveKtpSpouse(
    { spouseKtpObj: { ...data }, isSpouse: true },
    { ...config, headers: { Authorization: getToken()?.idToken } },
  )
}

export const updateKtpCity = (
  data: updateKtpCityPayloadType,
  config?: AxiosRequestConfig,
) => {
  return putUpdateKtpCity({ ...data }, { ...config })
}

export const deleteAccount = (
  payload: DeleteAccountRequestType,
  config?: AxiosRequestConfig,
) => {
  return postDeleteAccount(
    {
      createdBy: payload.createdBy,
    },
    { ...config, headers: { Authorization: getToken()?.idToken } },
  )
}

export const updateProfile = (
  data: UpdateProfileType,
  config?: AxiosRequestConfig,
) => {
  return postUpdateProfile(data, {
    ...config,
    headers: { Authorization: getToken()?.idToken },
  })
}
