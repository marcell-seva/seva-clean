import {
  CustomerKtpSeva,
  DeleteAccountRequestType,
  SendInstantApproval,
  UpdateProfileType,
} from './../../utils/types/utils'
import get from './get'
import post from './post'
import { collections } from './collections'
import { AxiosRequestConfig } from 'axios'
import {
  LoanCalculatorAsuransiKombinasiPayloadType,
  LoanCalculatorIncludePromoPayloadType,
  LoanCalculatorInsuranceParams,
  SendKualifikasiKreditRequest,
  SendMultiKualifikasiKredit,
  SpecialRateRequest,
} from 'utils/types/utils'
import { CreateProbeTrackRequest } from 'services/probe'
import environments from 'helpers/environments'
import { AES } from 'crypto-js'
// import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
// import { getLocalStorage } from 'utils/handler/localStorage'
// import { UTMTagsData } from 'utils/types/props'
// import { LocalStorageKey } from 'utils/enum'

// const getDataToken = () => {
//   const dataToken = localStorage.getItem('token')
//   const token = dataToken !== null ? JSON.parse(dataToken) : null
//   return token
// }

// const setDataToken = (payload: any) => {
//   localStorage.setItem('token', JSON.stringify(payload))
// }

// const requestNewToken = async (payload: any) => {
//   try {
//     const res = await api.postRefreshToken({ refreshToken: payload })
//     return res
//   } catch (error) {
//     throw error
//   }
// }

// axios.interceptors.response.use(
//   (res) => {
//     return res
//   },
//   async (err) => {
//     const originalConfig = err.config
//     const statusCode = err.response.status
//     const dataToken = getDataToken()

//     if (statusCode === 400)
//       window.location.href = 'https://www.seva.id/masuk-akun'
//     else if (statusCode === 401) {
//       const userToken: any = await requestNewToken(dataToken.refreshToken)
//       setDataToken(userToken)
//       originalConfig._retry = true
//       originalConfig.headers.Authorization = userToken.idToken
//       return axios(originalConfig)
//     }
//     return Promise.reject(err)
//   },
// )

const getConfigToken = () => {
  const dataToken = localStorage.getItem('token')
  const userToken = dataToken !== null ? JSON.parse(dataToken).idToken : null
  const config = {
    headers: { Authorization: userToken },
  }
  return config
}

// get request
const getMenu = () => get(collections.utils.menu)
const getCities = () => get(collections.utils.cities)
const getTestimony = () => get(collections.utils.testimonials)
const getRecommendation = (params?: string, config?: AxiosRequestConfig) =>
  get(collections.product.recommendation + params, config)
const getUsage = () => get(collections.utils.usage)
const getMetaTagData = (carModel: string) =>
  get(collections.utils.metaTag + carModel)
const getMainArticle = (params: string) =>
  get(collections.article.mainArticle + params, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
const getSubArticle = (params: number) =>
  get(collections.article.subArticle + params)
const getCarModelDetails = (
  id: string,
  params: string,
  config?: AxiosRequestConfig,
) => get(collections.product.modelDetails.replace(':id', id) + params, config)
const getCarVariantDetails = (
  id: string,
  params: string,
  config?: AxiosRequestConfig,
) => get(collections.product.variantDetails.replace(':id', id) + params, config)
const getVariantCar = (params?: string, config?: AxiosRequestConfig) =>
  get(collections.product.variant + params, config)
const getTypeCar = (params: string, config?: AxiosRequestConfig) =>
  get(collections.product.type + params, config)
const getBanner = () => get(collections.utils.banner)
const getCarofTheMonth = (city?: string) =>
  get(collections.product.carofTheMonth + (city ? `?city=${city}` : ''))
const getCarVideoReview = () => get(collections.product.carVideoReview)
const getAnnouncementBox = (config: AxiosRequestConfig) =>
  get(collections.utils.announcementBox, config)
const getUserInfo = () => get(collections.auth.user, getConfigToken())
const getSupportedBrowsers = () => get(collections.utils.supportedBrowser)
const getMobileFooterMenu = () => get(collections.utils.mobileFooterMenu)
const getMobileHeaderMenu = () => get(collections.utils.mobileHeaderMenu)
const getMinMaxPrice = (params: string, config?: AxiosRequestConfig) =>
  get(collections.product.pricing + params, config)
const getSearchDataQuery = (params: string, config?: AxiosRequestConfig) =>
  get(collections.utils.search + params, config)
const getIncomeList = () => get(collections.utils.incomeList)
const getLoanCalculatorInsurance = (params: LoanCalculatorInsuranceParams) =>
  get(
    collections.loanCalculator.insurance
      .replace(':modelId', params.modelId)
      .replace(':cityCode', params.cityCode)
      .replace(':tenure', params.tenure.toString()),
  )
const getCustomerKtpSeva = (config: AxiosRequestConfig) =>
  get(collections.ktp.customer, config)
const getCustomerSpouseKtpSeva = (config: AxiosRequestConfig) =>
  get(collections.ktp.customerSpouse, config)
const getAvailableNIK = (config?: AxiosRequestConfig) =>
  get(collections.utils.checkNIKAvailable, config)

// post request
const postUnverifiedLeadsNew = (body: any) => {
  const config = {
    headers: {
      'torq-api-key': environments.unverifiedLeadApiKey,
      'Content-Type': 'text/plain',
    },
  }

  const encryptedPayload = AES.encrypt(
    JSON.stringify(body),
    process.env.NEXT_PUBLIC_LEAD_PAYLOAD_ENCRYPTION_KEY ?? '',
  ).toString()

  return post(collections.leads.unverifiedLeadNew, encryptedPayload, config)
}
const postRefreshToken = (body: any, config?: AxiosRequestConfig) =>
  post(collections.auth.refresh, body, config)
const postSendSMSGeneration = (recaptchaToken: string, phoneNumber: string) =>
  post(collections.auth.otp, { recaptchaToken, phoneNumber })
const postVerifyOTPGeneration = (code: string, phoneNumber: string) =>
  post(collections.auth.otpVerification, { code, phoneNumber })
const postNewFunnelLoanSpecialRate = (
  body: SpecialRateRequest,
  config: AxiosRequestConfig,
) => post(collections.loanCalculator.specialRate, body, config)
const postNewFunnelCityRecommendations = (
  body: {
    modelName: string
    city: string
  },
  config?: AxiosRequestConfig,
) => post(collections.product.cityRecommendation, body, config)
const postCustomerAssistantDetails = (phoneNumber: string) =>
  post(collections.leads.customerAssistantDetails, { phoneNumber })
const postCheckPromoGiias = (promoCode: string) =>
  post(collections.utils.checkPromoCodeGias, { promoCode })
const postProbeTrack = (body: CreateProbeTrackRequest) =>
  post(collections.utils.probe, { body })
const postLoanPermutationIncludePromo = (
  body: LoanCalculatorIncludePromoPayloadType,
) => post(collections.loanCalculator.loanPermutationIncludePromo, body)
const postLoanPermutationAsuransiKombinasi = (
  body: LoanCalculatorAsuransiKombinasiPayloadType,
) => post(collections.loanCalculator.loanPermutationAsuransiKombinasi, body)
const postUploadFile = (body: any, config: AxiosRequestConfig) =>
  post(collections.upload.file, body, config)
const postUploadKTPFile = (body: any, config: AxiosRequestConfig) =>
  post(collections.upload.ktpFile, body, config)
const postUploadFileNew = (body: any, config: AxiosRequestConfig) =>
  post(collections.upload.fileNew, body, config)
const postCreditQualification = (
  body: SendKualifikasiKreditRequest,
  config: AxiosRequestConfig,
) => post(collections.creditQualification.single, body, config)
const postMultiCreditQualification = (
  body: SendMultiKualifikasiKredit,
  config: AxiosRequestConfig,
) => post(collections.creditQualification.multi, body, config)
const postInstantApproval = (
  body: SendInstantApproval,
  config: AxiosRequestConfig,
) => post(collections.creditQualification.instantApproval, body, config)
const postCheckReferralCode = (
  body: {
    refcode: string
    phoneNumber: string
  },
  config: AxiosRequestConfig,
) => post(collections.utils.checkReferralCode, body, config)
const postSaveKtp = (body: CustomerKtpSeva, config: AxiosRequestConfig) =>
  post(collections.ktp.saveKtp, body, config)
const postSaveKtpSpouse = (
  body: {
    spouseKtpObj: CustomerKtpSeva
    isSpouse: boolean
  },
  config: AxiosRequestConfig,
) => post(collections.ktp.saveKtpSpouse, body, config)
const postDeleteAccount = (
  body: DeleteAccountRequestType,
  config?: AxiosRequestConfig,
) => post(collections.profile.deleteAccount, body, config)
const postUpdateProfile = (
  body: UpdateProfileType,
  config: AxiosRequestConfig,
) => post(collections.profile.updateProfile, body, config)

export const api = {
  getMenu,
  getCities,
  getTestimony,
  getRecommendation,
  getUsage,
  getMetaTagData,
  getMainArticle,
  getSubArticle,
  getCarModelDetails,
  getCarVariantDetails,
  getVariantCar,
  getTypeCar,
  getBanner,
  getCarofTheMonth,
  getCarVideoReview,
  getAnnouncementBox,
  getUserInfo,
  getMobileFooterMenu,
  getMobileHeaderMenu,
  getMinMaxPrice,
  getSearchDataQuery,
  getSupportedBrowsers,
  getIncomeList,
  getLoanCalculatorInsurance,
  getCustomerKtpSeva,
  getCustomerSpouseKtpSeva,
  getAvailableNIK,

  postUnverifiedLeadsNew,
  postRefreshToken,
  postSendSMSGeneration,
  postVerifyOTPGeneration,
  postNewFunnelLoanSpecialRate,
  postNewFunnelCityRecommendations,
  postCustomerAssistantDetails,
  postCheckPromoGiias,
  postProbeTrack,
  postLoanPermutationIncludePromo,
  postLoanPermutationAsuransiKombinasi,
  postUploadFile,
  postUploadKTPFile,
  postUploadFileNew,
  postCreditQualification,
  postMultiCreditQualification,
  postInstantApproval,
  postCheckReferralCode,
  postSaveKtp,
  postSaveKtpSpouse,
  postDeleteAccount,
  postUpdateProfile,
}
