import { AxiosResponse } from 'axios'
import { defaultCSANumber } from 'const/const'
import {
  CountryCodePlusSign,
  defaultContactFormValue,
} from 'context/useContactFormData/useContactFormData'
import endpoints from 'helpers/endpoints'
import urls from 'helpers/urls'
import { API } from 'utils/api'
import { LocalStorageKey } from 'utils/enum'
import { getLocalStorage } from 'utils/localstorageUtils'
import { CreateUnverifiedLeadRequestNew, UTMTagsData } from 'utils/types/utils'
import { getStoredContactFormData } from './auth'

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

interface GetCustomerAssistantResponse {
  crmId: string
  name: string
  phoneNumber: string
}

const getCustomerAssistantDetails = (phoneNumber: string) => {
  return API.post(endpoints.customerAssistantDetails, {
    phoneNumber,
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
