export interface User {
  id: number
  phoneNumber: string
  fullName: string
  gender: string
  dob: any
  email: string
  createdAt: string
  updatedAt: string
  registType: any
  alreadyLogin: boolean
  marital: string
  promoSubscription: any
  temanSevaTrxCode: any
  customerUuid: any
  isSales: boolean
  salesBu: any
  isCrmCustomer: boolean
}

export interface Token {
  expires: string
  idToken: string
  refreshToken: string
}

export interface Filter {
  age?: string
  downPaymentAmount?: string
  monthlyIncome?: string
  tenure?: number
  carModel?: string
  downPaymentType?: string
  monthlyInstallment?: any
  sortBy?: string
  bodyType?: Array<string>
  brand?: Array<string>
}

export interface UTM {
  utm_id: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
  adset: string | null
}

export interface Location {
  cityCode: string
  cityName: string
  id: number
  province: string
}
