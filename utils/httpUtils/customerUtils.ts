import {
  getCustomerInfoWrapperSeva,
  getCustomerKtpSeva,
  getCustomerSpouseKtpSeva,
} from 'utils/handler/customer'

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
