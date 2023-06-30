import { AxiosRequestConfig } from 'axios'
import endpoints from 'helpers/endpoints'
import { API } from 'utils/api'

export const sendSMSGeneration = (
  recaptchaToken: string,
  phoneNumber: string,
  config?: AxiosRequestConfig,
) => {
  return API.post(
    endpoints.sendSMS,
    {
      phoneNumber: phoneNumber,
      recaptchaToken,
    },
    config,
  )
}

export const verifyOTPGeneration = (
  otpCode: string,
  phoneNumber: string,
  config?: AxiosRequestConfig,
) => {
  return API.post(
    endpoints.verifyOTP,
    {
      code: otpCode,
      phoneNumber: phoneNumber,
    },
    config,
  )
}
