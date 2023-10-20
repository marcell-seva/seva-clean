import { NextParsedUrlQuery } from 'next/dist/server/request-meta'
import { LoanRank } from './models'

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
  idToken: string
  refreshToken: string
  expiresIn: string
  localId: string
  isNewUser: boolean
  phoneNumber: string
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
  priceRangeGroup?: string
}

export interface FilterParam extends NextParsedUrlQuery {
  bodyType: string
  brand: string
  downPaymentAmount: string
  monthlyIncome: string
  tenure: string
  priceRangeGroup: string
  priceStart?: string
  priceEnd?: string
  yearStart?: string
  yearEnd?: string
  age: string
  sortBy: string
}

export interface FunnelQuery extends Filter {
  paymentType?: string
  downPaymentType?: string
  downPaymentPercentage?: string
  category?: string[]
  minPrice?: string
  maxPrice?: string
  minYear?: string
  maxYear?: string
  minMileage?: string
  maxMileage?: string
  yearStart?: string
  yearEnd?: string
  mileageStart?: string
  mileageEnd?: string
  transmission?: string
  city_id?: string[]
  priceStart?: string
  priceEnd?: string
  priceRangeGroup?: string
  phoneNumber?: string
  isDefaultTenureChanged?: boolean
  filterFincap?: boolean
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

export interface LoanDetail {
  loanRank: LoanRank
  tenure: number
  dpAmount: number
  monthlyInstallment: number
}

export interface CarVariantLoan extends LoanDetail {
  id: string
  modelId?: string
  priceValue: number
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
  base64?: string
}

export interface CarRecommendationResponse {
  carRecommendations: CarRecommendation[]
  lowestCarPrice: number
  highestCarPrice: number
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
  rasioBahanBakar: string
}

export interface MinMaxPrice {
  maxPriceValue: number
  minPriceValue: number
}

export interface MinMaxYear {
  maxYearValue: number
  minYearValue: number
}

export interface MinMaxMileage {
  maxMileageValue: number
  minMileageValue: number
}

export interface CarButtonProps {
  key: string
  icon: JSX.Element
  value: string
  isChecked?: boolean
  hide?: boolean
}

export interface UsedCarMedia {
  mediaCode: string
  order: number
  url: string
}

export interface UsedCarSpecification {
  specCode: string
  value: string
}

export type UsedCarRecommendation = {
  carId: string
  mainImage: string
  carSpecifications: UsedCarSpecification[]
  cityCode: number
  cityId: number
  cityName: string
  model: string
  priceFormatedValue: string
  sevaUrl: string
  skuCode: string
  variantName: string
  mileage: number
  year: number
}

export interface UsedCarRecommendationResponse {
  carRecommendations: UsedCarRecommendation[]
  totalItems: number
}
