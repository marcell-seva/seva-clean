import { LocalStorageKey } from 'utils/enum'
import { testPhoneNumber } from 'utils/helpers/const'

export const getOtpIsSent = () => {
  return localStorage.getItem(LocalStorageKey.OtpIsSent)
}

export const saveOtpIsSent = (value: string) => {
  localStorage.setItem(LocalStorageKey.OtpIsSent, value)
}

export const getOtpTimerIsStart = () => {
  return localStorage.getItem(LocalStorageKey.OtpTimerIsStart)
}

export const saveOtpTimerIsStart = (value: string) => {
  localStorage.setItem(LocalStorageKey.OtpTimerIsStart, value)
}

export const isTestPhoneNumber = (phoneNumber: string | undefined) => {
  if (phoneNumber) {
    return testPhoneNumber.includes(phoneNumber)
  } else {
    return false
  }
}
