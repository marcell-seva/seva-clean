import { getStoredContactFormData } from './auth'
import { getLocalStorage } from 'utils/localstorageUtils'
import { ContactType, LocalStorageKey } from 'utils/models/models'
import { UTMTagsData } from 'utils/types/utils'
import { API } from 'utils/api'
import endpoints from 'helpers/endpoints'
import { defaultCSANumber } from 'const/const'
import {
  CountryCodePlusSign,
  defaultContactFormValue,
} from 'utils/hooks/useContactFormData/useContactFormData'
import { AxiosResponse } from 'axios'
import urls from 'helpers/urls'

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
  return API.post(endpoints.customerAssistantDetails, {
    phoneNumber,
  })
}

export const createUnverifiedLeadNew = (
  requestBody: CreateUnverifiedLeadRequestNew,
) => {
  const UTMTags = getLocalStorage<UTMTagsData>(LocalStorageKey.UtmTags)
  return API.post(endpoints.unverifiedLeadNew, {
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
