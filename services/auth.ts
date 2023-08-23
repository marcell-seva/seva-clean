import { api } from 'services/api'
import {
  encryptedPrefix,
  decryptValue,
  encryptValue,
} from 'utils/encryptionUtils'
import { LocalStorageKey } from 'utils/enum'
import { defaultContactFormValue } from 'utils/hooks/useContactFormData/useContactFormData'

export const sendSMSGeneration = (
  recaptchaToken: string,
  phoneNumber: string,
) => {
  return api.postSendSMSGeneration(recaptchaToken, phoneNumber)
}

export const verifyOTPGeneration = (code: string, phoneNumber: string) => {
  return api.postVerifyOTPGeneration(code, phoneNumber)
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
