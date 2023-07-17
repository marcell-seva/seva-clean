import { getCustomerInfoWrapperSeva } from 'services/customer'

export const fetchCustomerDetails = async (): Promise<any | null> => {
  try {
    const responseCustomerInfo: any = await getCustomerInfoWrapperSeva()
    return responseCustomerInfo.data
  } catch (e) {
    return null
  }
}

export const fetchCustomerName = async (): Promise<string | null> => {
  try {
    const responseCustomerInfo: any = await getCustomerInfoWrapperSeva()
    return responseCustomerInfo.data[0].fullName
  } catch (e) {
    return null
  }
}
