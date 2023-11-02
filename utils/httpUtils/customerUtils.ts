import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { AES } from 'crypto-js'
import environments from 'helpers/environments'
import { collections } from 'services/api/collections'
import post from 'services/api/post'
import { LocalStorageKey } from 'utils/enum'
import { getToken } from 'utils/handler/auth'
import {
  getCustomerInfoWrapperSeva,
  getCustomerKtpSeva,
  getCustomerSpouseKtpSeva,
} from 'utils/handler/customer'
import { getLocalStorage } from 'utils/handler/localStorage'
import urls from 'utils/helpers/url'
import { CustomerRegister, PAALinkInfoProps } from 'utils/types/models'
import { UTMTagsData } from 'utils/types/utils'

export const fetchCustomerDetails = async (): Promise<any | null> => {
  try {
    const responseCustomerInfo: any = await getCustomerInfoWrapperSeva()
    return responseCustomerInfo
  } catch (e) {
    return null
  }
}

export const fetchCustomerName = async (): Promise<string | null> => {
  try {
    const responseCustomerInfo: any = await getCustomerInfoWrapperSeva()
    return responseCustomerInfo[0].fullName
  } catch (e) {
    return null
  }
}

export const fetchCustomerKtp = async (): Promise<any | null> => {
  try {
    const responseCustomerInfo: any = await getCustomerKtpSeva()
    return responseCustomerInfo
  } catch (e) {
    return null
  }
}

export const fetchCustomerSpouseKtp = async (): Promise<any | null> => {
  try {
    const responseCustomerInfo: any = await getCustomerSpouseKtpSeva()
    return responseCustomerInfo.data
  } catch (e) {
    return null
  }
}

export const checkRegisteredCustomer = (
  phoneNumber?: string,
  config?: AxiosRequestConfig,
) => {
  return post(
    collections.auth.checkRegistered,
    { phoneNumber: phoneNumber },
    config,
  )
}

export const registerCustomerSeva = ({
  phoneNumber,
  fullName,
  dob,
  gender,
  email,
  promoSubscription,
  marital,
  referralCode,
}: CustomerRegister) => {
  return post(collections.auth.createCustomer, {
    phoneNumber,
    fullName,
    dob,
    gender,
    email,
    promoSubscription,
    marital,
    referralCode,
  })
}

export const getPAAIAInfo = (
  orderId: string,
): Promise<
  AxiosResponse<{
    code: string
    data: PAALinkInfoProps
    message: string
  }>
> => {
  return post(
    collections.leads.paIaInfo + orderId,
    {},
    {
      headers: {
        Authorization: getToken()?.idToken,
      },
    },
  )
}

export const sendRefiContact = (
  phoneNumber?: string,
  fullName?: string,
  source?: string,
  isLogin?: boolean,
  temanSevaTrxCode?: string,
) => {
  const UTMTags = getLocalStorage<UTMTagsData>(LocalStorageKey.UtmTags)
  const payload = {
    phoneNumber: phoneNumber,
    name: fullName,
    source: source,
    isLogin: isLogin,
    temanSevaTrxCode: temanSevaTrxCode,
    utmSource: UTMTags?.utm_source,
    utmMedium: UTMTags?.utm_medium,
    utmCampaign: UTMTags?.utm_campaign,
    utmId: UTMTags?.utm_id,
    utmContent: null, // temporary
    utmTerm: UTMTags?.utm_term,
    adSet: UTMTags?.adset,
  }
  const encryptedPayload = AES.encrypt(
    JSON.stringify(payload),
    process.env.REACT_APP_LEAD_PAYLOAD_ENCRYPT_KEY ?? '',
  ).toString()

  const config = {
    headers: {
      'torq-api-key': environments.unverifiedLeadApiKey,
      'Content-Type': 'text/plain',
    },
  }

  return post(urls.internalUrls.sendRefiContact, encryptedPayload, config)
}
