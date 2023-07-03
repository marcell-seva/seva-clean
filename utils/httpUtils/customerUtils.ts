import { getCustomerInfoWrapperSeva } from 'services/customer'

export const fetchCustomerDetails = async (): Promise<any | null> => {
  try {
    const responseCustomerInfo: any = await getCustomerInfoWrapperSeva()
    return responseCustomerInfo.data
  } catch (e) {
    return null
  }
}
