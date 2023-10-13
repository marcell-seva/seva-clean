import { api } from 'services/api'
import { AxiosResponse } from 'axios'
import { defaultCSANumber } from 'utils/helpers/const'
import urls from 'helpers/urls'
import { getLocalStorage } from 'utils/handler/localStorage'
import { UTMTagsData } from 'utils/types/utils'
import { ContactType, LocalStorageKey } from 'utils/enum'
import {
  CountryCodePlusSign,
  defaultContactFormValue,
} from 'utils/hooks/useContactFormData/useContactFormData'
import {
  decryptValue,
  encryptValue,
  encryptedPrefix,
} from 'utils/encryptionUtils'

export enum UnverifiedLeadSubCategory {
  SEVA_NEW_CAR_LP_LEADS_FORM = 'SEVNCLFH',
  SEVA_NEW_CAR_HUBUNGI_KAMI = 'SEVNCCUS',
  SEVA_NEW_CAR_CAR_OF_THE_MONTH = 'SEVNCCOM',
  SEVA_NEW_CAR_PROMO_LEADS_FORM = 'SEVNCPLF',
  SEVA_NEW_CAR_PDP_LEADS_FORM = 'SEVNCVLF',
  SEVA_NEW_CAR_PLP_LEADS_FORM = 'SEVNCSPF',
  SEVA_NEW_CAR_SEARCH_WIDGET = 'SEVNCSWG',
  SEVA_NEW_CAR_OFFLINE_EVENT_FORM_COLD = 'SEVNCOEC',
  SEVA_NEW_CAR_OFFLINE_EVENT_FORM_HOT = 'SEVNCOEH',
}

interface GetCustomerAssistantResponse {
  crmId: string
  name: string
  phoneNumber: string
}

export interface CreateUnverifiedLeadRequestNew {
  origination: UnverifiedLeadSubCategory
  name?: string
  phoneNumber: string
  contactType?: ContactType
  email?: string
  sevaKnowledge?: string
  isPurchaseSoon?: boolean
  sevaCarBrands?: string[]
  otherCarBrand?: string[]
  paymentPreference?: string
  income?: string
  age?: string
  tenure?: number
  dp?: number
  otrPrice?: number
  monthlyInstallment?: number
  promo?: string
  carBrand?: string
  carModelText?: string
  cityId?: number
  platform?: string
}

const getCustomerAssistantDetails = (phoneNumber: string) => {
  return api.postCustomerAssistantDetails(phoneNumber)
}

export const createUnverifiedLeadNew = (
  requestBody: CreateUnverifiedLeadRequestNew,
) => {
  const UTMTags = getLocalStorage<UTMTagsData>(LocalStorageKey.UtmTags)
  return api.postUnverifiedLeadsNew({
    ...requestBody,
    utmSource: UTMTags?.utm_source,
    utmMedium: UTMTags?.utm_medium,
    utmCampaign: UTMTags?.utm_campaign,
    utmId: UTMTags?.utm_id,
    utmContent: null, // temporary
    utmTerm: UTMTags?.utm_term,
    adSet: UTMTags?.adset,
  })
}

export const getCustomerAssistantWhatsAppNumber = async () => {
  let csaWhatsAppNumber = defaultCSANumber
  try {
    const contactData = getStoredContactFormData()
    const phoneNumber = contactData.phoneNumber
    if (
      phoneNumber &&
      phoneNumber !== CountryCodePlusSign &&
      phoneNumber !== defaultContactFormValue.phoneNumber
    ) {
      const csaDetails: AxiosResponse<GetCustomerAssistantResponse> =
        await getCustomerAssistantDetails(phoneNumber)
      csaWhatsAppNumber = csaDetails.data.phoneNumber.replace(
        CountryCodePlusSign,
        '',
      )
    }
  } catch (e) {}
  return `${urls.whatsappUrlPrefix}${csaWhatsAppNumber}`
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
