import { api } from 'services/api'
import { AxiosRequestConfig } from 'axios'
import { defaultContactFormValue } from 'context/useContactFormData/useContactFormData'
import endpoints from 'helpers/endpoints'
import { API } from 'utils/api'
import {
  encryptedPrefix,
  decryptValue,
  encryptValue,
} from 'utils/encryptionUtils'
import { LocalStorageKey } from 'utils/enum'

export const sendSMSGeneration = (
  recaptchaToken: string,
  phoneNumber: string,
) => {
  return api.postSendSMSGeneration(recaptchaToken, phoneNumber)
}

export const verifyOTPGeneration = (otpCode: string, phoneNumber: string) => {
  return api.postVerifyOTPGeneration(otpCode, phoneNumber)
}

export const getStoredContactFormData = () => {
  let dataInLocalstorage = localStorage.getItem(LocalStorageKey.ContactForm)

  if (dataInLocalstorage?.includes(encryptedPrefix)) {
    dataInLocalstorage = decryptValue(dataInLocalstorage)
  }

  // if decryption failed, overwrite existing data with default value
  if (dataInLocalstorage === '') {
    localStorage.setItem(
      LocalStorageKey.ContactForm,
      encryptValue(JSON.stringify(defaultContactFormValue)),
    )
    return defaultContactFormValue
  }

  return dataInLocalstorage
    ? JSON.parse(dataInLocalstorage)
    : defaultContactFormValue
}
