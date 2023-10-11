import { ReactElement } from 'react'

import { ContactType, UnverifiedLeadSubCategory, UTMTags } from 'utils/enum'
import {
  CustomerPreApprovalStatus,
  InstallmentTypeOptions,
  LoanRank,
} from './models'

export type FormControlValue = string | number | readonly string[] | undefined

export interface CreateProbeTrackRequest {
  utmCampaign: string
  campaignId?: number
  utmContent?: string
  adsetId?: string
  utmTerm?: string
  adId?: number
  platform?: string
  fullName?: string
  email?: string
  phoneNumber?: string
  city?: string
  carVariant?: string
  loanDownPayment?: number
  utmSource?: string
  dmContactable?: string
  dmDataValidation?: string
  dmDataValidationAnswerDate?: string
  dmEndJourneyDate?: string
  dmValidation?: string
}

export interface Option<T extends FormControlValue> {
  label: string
  value: T
  testid?: string
}

export interface OptionWithImage<T extends FormControlValue> {
  image?: string
  label: string
  value: T
  disabled?: boolean
  brand?: string
  testid?: string
}

export interface OptionWithText<T extends FormControlValue> {
  text?: string
  label: string
  value: T
  testid?: string
}

export type CheckboxItemType = {
  value: string
  label: string
  isChecked: boolean
  image?: () => ReactElement
  subOptions?: CheckboxItemType[]
}

export interface Time {
  hours: string
  minutes: string
  seconds: string
}
export interface Location {
  cityName: string
  cityCode: string
  id?: string
  province: string
}

export interface Article {
  title: string
  category: string
  category_link: string
  url: string
  excerpt: string
  publish_date: string
  writer_name: string
  writer_initial: string
  featured_image: string
}

export interface Banner {
  name: string
  creativeContext: string
  slot: string
  url: string
  attribute: {
    web_desktop: string
    web_mobile: string
  }
}

export interface Car {
  brand: string
  model: string
  image: string
  variants: any
}

export interface CarDetail {
  brand: string
  model: {
    description: string
    url: string
    data: { image: string }
    carModel: {
      brand: string
      model: string
    }
  }
}

export interface Testimony {
  pictureUrl: string
  name: string
  cityName: string
  purchaseDate: string
  rating: number
  detail: string
}

export interface HowToUseSection {
  head_title: string
  title_1: string
  subtitle_1: string
  icon_1: { data: { attributes: { url: string } } }
  title_2: string
  subtitle_2: string
  icon_2: { data: { attributes: { url: string } } }
  title_3: string
  subtitle_3: string
  icon_3: { data: { attributes: { url: string } } }
}

export interface Variant {
  id: string
  model: string
  code: string
  variant_name: string
  variant_title: string
  price_currency: string
  price_value: number
  price_formatted_value: string
}

export interface Form {
  name: string
  phone: string
  whatsapp: boolean
}
export interface FormWidget {
  age: string
  dp: string
  income: string
  tenure: number
}

export interface Menu {
  id: number
  menuCode: string
  menuDesc: string
  menuLevel: string
  menuName: string
  menuOrder: number
  menuParent: string
  menuUrl: string
  status: boolean
  toogleNew: boolean
  subMenu: Array<Menu>
}

export interface UTMCollector {
  utm_id: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
  adset: string | null
}

export interface BodyType {
  body_type: string
  data_count: number
}

export interface AnnouncementBoxDataType {
  id: number
  title: string
  data: {
    folder: string
    icon: string
    thumbnail: {
      icon: string
    }
  }
  url: string | null
  description: string
  textDisplay: string | null
  backgroundColor: string
  bannerDesign: string
  userTarget: string
}

export interface UTMTagsData {
  [UTMTags.UtmSource]: string | null
  [UTMTags.UtmMedium]: string | null
  [UTMTags.UtmCampaign]: string | null
  [UTMTags.UtmContent]: string | null
  [UTMTags.UtmTerm]: string | null
  [UTMTags.UtmId]: string | null
  [UTMTags.Adset]: string | null
}
export interface LoanDetail {
  loanRank: LoanRank
  tenure: number
  dpAmount: number
  monthlyInstallment: number
  monthlyInstallmentSpekta?: number
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

export interface CarResultIndexPage {
  startIndex: number
  endIndex: number
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

export interface VideoDataType {
  thumbnailVideo: string
  title: string
  videoSrc: string
  videoId: string
  accountName: string
  date: string
}

export interface SpecialRateListType {
  tenure: number
  interestRate: number
  dp: number
  dpAmount: number
  installment: number
  saveAmount: number
  loanRank: string
  totalFirstPayment: number
  totalFirstPaymentADDB: number
  totalFirstPaymentADDM: number
}

export interface SpecialRateList {
  tenure: number
  interestRate: number
  dp: number
  dpAmount: number
  installment: number
  saveAmount: number
  loanRank: string
  totalFirstPayment: number
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

export interface CustomerInfoSeva {
  id: number
  phoneNumber: string
  fullName: string
  gender: string
  dob: string
  nik: string
  email: string
  marital: string
  registType: string
  isSales: boolean
  isCrmCustomer: boolean
  createdAt?: string
}

export interface MobileWebTopMenuItemType {
  menuName: string
  menuDesc: string
  menuCode: string
  menuParent: string | null
  menuUrl: string | null
  menuLevel: number
  status: boolean
  menuOrder: number
  toggleNew: boolean
  menuType: string
  subMenu: MobileWebTopMenuItemType[]
}
export interface MobileWebTopMenuType extends MobileWebTopMenuItemType {
  subMenu: MobileWebTopMenuItemType[]
}

export interface CityOtrOption {
  cityName: string
  cityCode: string
  province: string
  id?: string
}

export interface CarModelBasicInfo {
  id: string
  brand: string
  model: string
  promoFlag: boolean
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

export interface CarVariantRecommendation extends CarVariant {
  loanRank: string
  tenure: number
  dpAmount: number
  monthlyInstallment: number
}

export interface SpecialRateRequest {
  otr: number
  dp: number
  dpAmount: number
  monthlyIncome?: number
  age?: string
  city: string
  discount: number
  rateType?: string
  angsuranType?: InstallmentTypeOptions
  isFreeInsurance?: boolean
}

export interface CarVariantListPageUrlParams {
  brand: string
  model: string
  tab: string
}

export interface AlephArticleCategoryType {
  label: string
  url: string
  value: string
  testid?: string
}

export interface dpRateCollectionNewCalculatorTmp {
  dpRate: number
  dpCalc: number
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

export interface FormLCState {
  city: CityOtrOption
  model:
    | {
        modelId: string
        modelName: string
        modelImage: string
        brandName: string
      }
    | undefined
  variant:
    | {
        variantId: string
        variantName: string
        otr: string
        discount: number
      }
    | undefined
  promoCode: string
  isValidPromoCode: boolean
  age: string
  monthlyIncome: string
  downPaymentAmount: string
  paymentOption: InstallmentTypeOptions
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

export interface MetaTagApiResponse {
  id: number
  attributes: {
    meta_title: string
    meta_description: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    location_page3: string
  }
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

export type VideoOptionType = {
  UploadedBy: string
  PostedDate: string
  videoUrl: string
}

export type MainVideoResponseType = {
  id: number
  modelId: string
  link: string
  thumbnail: string
  isMain: boolean
  title: string
  accountName: string
  createdAt: string
  updatedAt: string
  listVideo: VideoOptionType[]
}

export interface Time {
  hours: string
  minutes: string
  seconds: string
}

export interface CarVariantRecommendation extends CarVariant {
  loanRank: string
  tenure: number
  dpAmount: number
  monthlyInstallment: number
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
  rasioBahanBakar: string
}

export interface NewFunnelCarVariantDetails {
  modelDetail: CarModelBasicInfo
  variantDetail: VariantDetail
}

export interface CarVariantDetails extends NewFunnelCarVariantDetails {
  loanDetail: LoanDetail
}

export interface SpecialRateList {
  tenure: number
  interestRate: number
  dp: number
  dpAmount: number
  installment: number
  saveAmount: number
  loanRank: string
  totalFirstPayment: number
}

export interface SpecialRateListType {
  tenure: number
  interestRate: number
  dp: number
  dpAmount: number
  installment: number
  saveAmount: number
  loanRank: string
  totalFirstPayment: number
  totalFirstPaymentADDB: number
  totalFirstPaymentADDM: number
}

export interface FooterSEOAttributes {
  location_tag: string
  location_page2: string
  title_1: string
  Title_2: string
  Title_3: string
  content_1: string
  Content_2: string
  Content_3: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}
export interface ArticleCategoryType {
  name: string
  isSelected: boolean
  url: string
}

export interface AlephArticleCategoryType {
  label: string
  url: string
  value: string
  testid?: string
}

export type VideoReviewType = {
  brand: string
  Model: string
  MainVideoUrl: string
  listVideo: VideoOptionType[]
  UploadedBy: string
  PostedDate: string
}

export interface PreapprovalDataType {
  phoneNumber?: string
  occupation: string
  totalIncome: string
  province: string
  city: string
  zipCode: string
  email: string
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

export interface BannerHomepageType {
  name: string
  attribute: {
    web_desktop: string
    web_mobile: string
    native: string
    thumbnail: {
      web_desktop: string
      web_mobile: string
      native: string
    }
  }
  slot: string
  url: string
  creativeContext: string | null
}

export type IconThumbnail = {
  thumbnail: {
    name: string
  }
}

export type IconImage = {
  url: string
  formats: IconThumbnail
}

export interface USPAttributes {
  head_title: string
  icon_1: {
    data: {
      attributes: IconImage
    }
  }
  icon_2: {
    data: {
      attributes: IconImage
    }
  }
  icon_3: {
    data: {
      attributes: IconImage
    }
  }
  subtitle_1: string
  subtitle_2: string
  subtitle_3: string
  title_1: string
  title_2: string
  title_3: string
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

export type COMDataModel = {
  id: number
  modelId: string
  url: string
  startDate: string
  data: {
    folder: string
    image: string
    thumbnail: {
      image: string
    }
  }
  description: string
  modifiedBy: number
  status: boolean
  createdAt: string
  updatedAt: string
  isArchived: boolean
  variantId: string
  carModel: {
    id: string
    brand: string
    model: string
    imageUrls: {
      main_color: string[]
      colors: string[]
      gallery: string[]
      brochure: string[]
      new_funnel_main_color: string[]
    }
    promoFlag: boolean | null
    productCode: string | null
    status: boolean
    otrStatus: null
    modelWordpressTag: string
  }
  carCatalog: {
    id: number
    make: string
    model: string
    base_product: string
    body_type: string
    variant_name: string
    body_type_url: string
    code: string
    colour_name: string | null
    description_bahasa: string
    description_english: string
    engine_capacity: number
    price_currency: string
    price_formatted_value: string
    price_value: number
    seat: number
    variant_title: string
    transmission: string
    seva_url: string
    length: number
    width: number
    height: number
    fuel_type: string
    model_id: string
    variant_id: string
    discount: number
    price_value_sby: number | null
    price_formatted_value_sby: string | null
    status: boolean
  }
  priceValueJkt: number
  price: number | null
}

export type COMData = {
  id: number
  brand: string
  order: number
  status: boolean
  model?: COMDataModel
}

export interface TestimonialData {
  pictureName: string
  pictureUrl: string
  detail: string
  rating: number
  name: string
  age?: number
  cityName: string
  purchaseDate: string
  displayNumber: number
}

export interface ArticleData {
  title: string
  excerpt: string
  publish_date: string
  writer_name: string
  writer_initial: string
  category: string
  category_link: string
  url: string
  featured_image: string
}

export interface NavbarItemResponse {
  id: number
  menuName: string
  menuDesc: string
  menuCode: string
  menuParent: string
  menuUrl: string
  menuLevel: number
  status: boolean
  toggleNew: boolean
  subMenu: NavbarItemResponse[]
}

export interface PromoItemType {
  promo: string
  promoId: string
  promoTitle: string
  promoDesc: string
  is_Best_Promo: boolean
  is_Available: boolean
  promoFinishDate: string | null
}

export interface SpecialRateListWithPromoType {
  tenure: number
  interestRate: number
  interestRateSpekta: number
  interestRateGiias: number
  insuranceRate: number
  dp: number
  dpAmount: number
  installment: number
  installmentSpekta: number
  installmentGiias: number
  saveAmount: number
  totalFirstPayment: number
  totalFirstPaymentSpekta: number
  totalFirstPaymentGiias: number
  totalBayarSpekta: number
  totalBayarGiias: number
  applied: string
  promoArr: PromoItemType[]
  loanRank: string
  subsidiDp: number
}

export interface LoanCalculatorInsuranceAndPromoType {
  tenure: number
  allInsuranceList: Option<string>[]
  selectedInsurance: Option<string>
  applied: string
  allPromoList: PromoItemType[] // filled with promo list based on selected insurance
  allPromoListOnlyFullComprehensive: PromoItemType[] // only filled with promo list related to full comprehensive
  selectedPromo: PromoItemType[]
  tdpBeforePromo: number // same value as regular TDP
  tdpAfterPromo: number
  tdpWithPromo: number // temp value for TDP With promo before click submit(on pop up promo list)
  installmentBeforePromo: number // same value as regular installment
  installmentAfterPromo?: number
  installmentWithPromo?: number // temp value for Installment With promo before click submit(on pop up promo list)
  interestRateBeforePromo: number
  interestRateWithPromo?: number // temp value for Interest Rate With promo before click submit(on pop up promo list)
  interestRateAfterPromo?: number
  subsidiDp: number //value subsidi dp
}

export interface LoanCalculatorIncludePromoPayloadType {
  brand: string
  model: string
  age?: string
  angsuranType: string
  city: string
  discount: number
  dp: number
  dpAmount: number
  monthlyIncome: string
  otr: number
}

export interface LoanCalculatorInsuranceParams {
  modelId: string
  cityCode: string
  tenure: string | number
}

export interface LoanCalculatorAsuransiKombinasiPayloadType
  extends LoanCalculatorIncludePromoPayloadType {
  tenure: number
  asuransiKombinasi: string
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
  promoCode?: string
  fullName?: string
  customerName?: string
  monthlyIncome?: number
  spouseIncome?: number
  city?: string
  occupation?: string
  temanSevaTrxCode?: string
}

export interface SendKualifikasiKreditRequest {
  leadId?: string
  cityId: number
  variantId: string
  modelId: string
  priceOtr: number
  monthlyIncome: number
  loanDownPayment: number
  loanDownPaymentVanilla?: number
  totalFirstPayment: number
  totalFirstPaymentVanilla?: number
  angsuranType: InstallmentTypeOptions
  ageRange?: string
  promoCode: string
  loanTenure: number
  rateType: string
  flatRate: number
  flatRateVanilla?: number
  loanMonthlyInstallment: number
  loanMonthlyInstallmentVanilla?: number
  occupation: string
  insuranceType: string
  temanSevaTrxCode: string
  loanRank: string
  platform: 'web'
  selectablePromo?: string[]
}

export interface SendMultiKualifikasiKredit {
  cityId: number
  city: string
  priceRangeGroup: string
  recommendationType: string
  dpType: string
  maxDpAmount: string
  monthlyIncome: number
  tenure: number
  sortBy: string
  dob: string
  occupation: string
  transmission?: string
  limit?: number
  offset?: number
}

export type MultKKCarVariant = CarVariantLoan & {
  dp: number
  name: string
  transmission: string
  fuelType: string
  engineCapacity: number
  seat: number
  interestSpekta?: number
}

export type MultKKCarRecommendation = CarRecommendation & {
  rasioBahanBakar: string
  numberOfPopulation: number
  isPassengerCar: boolean
  creditQualificationStatus: string
  variants: MultKKCarVariant[]
  promo: PromoItemType | null
}

export interface SendMultiKualifikasiKreditResponse {
  leadId?: string
  totalItems: number
  totalItemsCurrentPage: number
  currentPage: number
  carRecommendations: MultKKCarRecommendation[]
  lowestCarPrice: number
  highestCarPrice: number
}

export interface SendInstantApproval {
  leadId: string | undefined
  leasing: string | undefined
  // useKtpSpouseAsMain: boolean
}

export type PopupPromoDataItemType = {
  title: string
  body: {
    title?: string
    body: string
  }[]
  snk: string
}

export interface CustomerKtpSeva {
  province: string
  city: string
  nik: string
  name: string
  birthdate: string
  gender: string
  address: string
  rtrw: string
  kel: string
  kec: string
  marriage: string
}

export interface GetCustomerKtpSeva {
  province: string
  city: string
  nik: string
  name: string
  birthdate: string
  gender: string
  address: string
  rtrw: string
  keldesa: string
  kecamatan: string
  marriage: string
  created: string
  isSpouse?: boolean
}

export type DeleteAccountRequestType = {
  phoneNumber: string
  createdBy?: string
  reason?: string
}

export interface UpdateProfileType {
  fullName: string
  dob: string
  gender: string
  marital: string
  email: string | null
}

export interface FinalLoan {
  selectedPromoFinal: PromoItemType[]
  selectedInsurance: any
  tppFinal: number | undefined
  installmentFinal: number | undefined
  interestRateFinal: number | undefined
  installmentBeforePromo: number
  tdpBeforePromo: number
  interestRateBeforePromo: number
}

export interface trackDataCarType {
  CAR_BRAND: string
  CAR_MODEL: string
  CAR_VARIANT: string
  PELUANG_KREDIT_BADGE: string
  TENOR_OPTION: string
  TENOR_RESULT: string
  IA_FLOW: string
  INCOME_CHANGE: string
  INCOME_LC: string | number
  INCOME_KK: number
}

export interface updateLeadFormOTO {
  leadId: string
  leadResponse: boolean
  isLeadQualified: boolean
  carVariantId: string
  carModelId: string
  cityId: number
  priceOtr: number
}

export interface updateLeadFormCM {
  leadId: string
  name: string
  phone: string
  salesId: number
  spkDate: string
  spkNo: string
  bstkDate: string
  bstkNo: string
}

export interface SalesAgent {
  branchCode: string
  branchName: string
  dealer: string
  id: number
  salesCodeNpk: string
  salesName: string
}
