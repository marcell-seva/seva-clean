import { LoanRank } from '../models/product'
import { IconProps } from '../components/icon/iconType'
import { CustomerPreApprovalStatus } from '../models/form'

export interface LoanDetail {
  loanRank: LoanRank
  tenure: number
  dpAmount: number
  monthlyInstallment: number
}

export interface CarResultIndexPage {
  startIndex: number
  endIndex: number
}

export interface CarVariantLoan extends LoanDetail {
  id: string
  modelId?: string
}

export interface SimpleCarVariantDetail {
  modelId: string
  variantId: string
  loanTenure: number
  loanDownPayment: number
  loanMonthlyInstallment: number
  loanRank: string
  totalFirstPayment?: number
  angsuranType?: string
  rateType?: string
  flatRate?: number
}

export type CarSuggestions = {
  id: number
  model: string
  variant_name: string
  variant_title: string
  price_currency: number
  price_value: number
  price_formatted_value: number
}

export interface CarSuggestionsResponse {
  carSuggestion: CarSuggestions[]
}

export interface CarModelResponse {
  id: string
  brand: string
  model: string
  lowestAssetPrice: number
  highestAssetPrice: number
  // brandAndModel: String
  image: string
  loanRank: string
  // modelAndBrand: String
  numberOfPopulation: number
  // variants: CarVariantRecommendation[]
}

export interface dpRateCollectionNewCalculatorTmp {
  dpRate: number
  dpCalc: number
}

export interface TemanSevaTransactionDataType {
  name: string
  carBrandModel: string
  carVariant: string
  priceOtr: number
  intensif: number
  date: string
  status: string
}

export interface TemanSevaRefereeDataType {
  id: number
  fullName: string
  phoneNumber: string
  email: string
  dob: string
  gender: string
  temanSevaTrxCode: string
  createdAt: string
}

export interface SPKItemType {
  customerName: string
  carBrand: string
  carModel: string
  carVariant: string
  carName: string
  priceOtr: number
  spkNo: string
  createdAt: string
  formattedDate: string
  leasingPartner: string
  fincoSalesName: string
  fincoSalesCompanyBranch: string
  fincoSalesNpk: string
  customerPhoneNumber: string
  customerNik: string
  dpAmount: number
  dp: number
  promoList: string[]
  installmentType: string
  loanTenure: number
  loanRate: number
  tpp: number
  loanMonthlyInstallment: number
  qty: number
}

export interface SalesInfoType {
  name: string
  companyBranch: string
  npk: string
  salesCode: string
}

export type CarRecommendation = {
  id: string
  brand: string
  model: string
  image: string
  images: string[]
  numberOfPopulation: number
  lowestAssetPrice: number
  highestAssetPrice: number
  height: number
  width: number
  length: number
  loanRank: string
  variants: CarVariantLoan[]
  brandAndModel?: string
  modelAndBrand?: string
}

export interface CarRecommendationResponse {
  carRecommendations: CarRecommendation[]
}

export interface CarVariant {
  id: string
  name: string
  priceValue: number
  fuelType: string
  transmission: string
  engineCapacity: number
  carSeats: number
  discount: number
}

export interface CarVariantRecommendation extends CarVariant {
  loanRank: string
  tenure: number
  dpAmount: number
  monthlyInstallment: number
}

export interface CarModelBasicInfo {
  id: string
  brand: string
  model: string
  promoFlag: boolean
}

export interface CarModelBasicDetailsResponse extends CarModelBasicInfo {
  variants: CarVariant[]
  images: string[]
}

export interface CarModelDetailsResponse {
  id: string
  brand: string
  model: string
  modelWordpressTag?: string
  promoFlag: boolean
  variants: CarVariantRecommendation[]
  images: string[]
  length?: number
  width?: number
  height?: number
}

export interface VariantDetail {
  id: string
  name: string
  priceValue: number
  fuelType: string
  transmission: string
  engineCapacity: number
  bodyType: string
  carSeats: number
  length: number
  pdfUrl: string
  images: string[]
  newFunnelMainColorImage: string
  description: {
    en: string
    id: string
  }
  discount: number
}

export interface VariantSpecifications {
  label: string
  title: string
  icon: (props: IconProps) => JSX.Element
  content: string
  contentLabel: string
}

export interface VariantDetailsInfo {
  discount: string
  loanEstimate: string
  downPayment: string
  price: string
  priceAmount: string
  installments: string
  tenure: string
  estimatesDes: string
  insuranceDes: string
  feesDes: string
  specifications: string
  description: string
  confirmAgent: string
  loanConfiguration: string
  loanApplyMessage: string
}

export interface IncomeAdjustmentRequest {
  monthlyInstallment: number
  monthlyIncome: number
}

export interface IncomeAdjustmentResponse {
  data: string
  recommendationInstallment?: number
}

export interface CustomerPreApprovalResponse {
  status: CustomerPreApprovalStatus
  loanTenure: number
  loanDownPayment: number
  loanMonthlyInstallment: number
  modelDetail: CarModelDetailsResponse
  variantDetail: VariantDetail
  finishedAt: number
  finco: string // 'ACC' | 'TAF'
}

export interface NewFunnelCarVariantDetails {
  modelDetail: CarModelBasicInfo
  variantDetail: VariantDetail
}

export interface CarVariantDetails extends NewFunnelCarVariantDetails {
  loanDetail: LoanDetail
}

export interface CustomerInfo {
  id: string
  phoneNumber: string
  name: string
  age: string
  gender: string
  occupation: string
  education: string
  city: string
  cashFlow: string[]
  fixedIncome: boolean
  monthlyIncome: number
  downPayment: number
  homeOwnership: boolean
  seatNumber: string[]
  variantId: string
  modelId: string
  loanDownPayment: number
  loanMonthlyInstallment: number
  loanTenure: number
  loanRank: string
  purchaseTime: string
  contactTime: string
  createdAt: number
  variant?: CarVariantDetails
  fullName: string
}
