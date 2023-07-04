import getCurrentEnvironment from 'helpers/environments'

export const temanSevaUrl = getCurrentEnvironment.temanSevaApiBaseUrl

export const temanSevaUrlPath = {
  isTemanSeva: temanSevaUrl + '/auth/is-teman-seva',
  profile: temanSevaUrl + '/auth/profile',
  existedCode: temanSevaUrl + '/auth/refcode/check-validity',
  transaction: temanSevaUrl + '/transaction/:referral',
  transactionSum: temanSevaUrl + '/transaction/:referral/sum',
  checkRefCode: temanSevaUrl + '/auth/is-valid-ref-code',
  totalReferee: temanSevaUrl + '/total-referee/:referral',
  checkRefCodeExistence: temanSevaUrl + '/referee/check/:referralCode',
  carRecommendations:
    temanSevaUrl + '/incentive/otr?city=cityCodeName&cityId=cityCodeId',
  refereeList: temanSevaUrl + '/referee/list/:refCode?sort=',
}

export type TemanSevaTransactionData = {
  leadId: string
  carBrand: string
  carModel: string
  carVariant: string
  priceOtr: number
  phoneNumber: string
  name: string
  goodIssueTime: string
  referralCode: string
  incentiveLable: string
  incentive: number
}

export interface TemanSevaTransaction {
  message: string
  data: TemanSevaTransactionData[]
}

export interface TemanSevaTransactionSum {
  message: string
  total_incentive: number
}

export interface TemanSevaTotalReferee {
  message: string
  data: number
}

export interface TemanSevaCarVariant {
  id: string
  loanRank: string
  tenure: number
  dpAmount: number
  monthlyInstallment: number
  dp: number
  priceValue: number
  incentiveLable: string
  incentive: number
}
export interface TemanSevaCarModel {
  id: string
  brand: string
  model: string
  promoFlag: boolean
  variants: TemanSevaCarVariant[]
  images: string[]
  image: string
  loanRank: string
  height: number
  width: number
  length: number
  lowestAssetPrice: number
  highestAssetPrice: number
  numberOfPopulation: number
}
export interface TemanSevaCarRecomemndations {
  message: string
  data: TemanSevaCarModel[]
}
