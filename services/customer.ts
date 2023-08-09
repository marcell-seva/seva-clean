import { AxiosResponse } from 'axios'
import { api } from 'services/api'
import { encryptValue } from 'utils/encryptionUtils'
import { LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { saveLocalStorage } from 'utils/localstorageUtils'
import { removeInformationWhenLogout } from 'utils/logoutUtils'
import { saveSessionStorage } from 'utils/sessionstorageUtils'
import { CustomerInfoSeva } from 'utils/types/utils'
import { setAmplitudeUserId } from './amplitude'

export const getCustomerInfoSeva = () => {
  return api.getUserInfo()
}

export const getCustomerInfoWrapperSeva = () => {
  return getCustomerInfoSeva()
    .then((response: AxiosResponse<CustomerInfoSeva[]>) => {
      const customerId = response.data[0].id ?? ''
      const customerName = response.data[0].fullName ?? ''
      setAmplitudeUserId(response.data[0].phoneNumber ?? '')
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
    })
    .catch((err: any) => {
      if (err?.response?.status === 404) {
        removeInformationWhenLogout()
      }
    })
}
