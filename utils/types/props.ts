import { HTMLAttributes } from 'react'
import { LoanRank, ToastType } from './models'
import { Location } from './utils'
import type { ModalProps } from 'antd'

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

export interface FunnelQuery {
  paymentType?: FormControlValue | string
  downPaymentType?: FormControlValue
  monthlyInstallment?: FormControlValue
  downPaymentAmount?: FormControlValue
  downPaymentPercentage?: FormControlValue
  brand?: string[]
  monthlyIncome?: FormControlValue
  age?: FormControlValue
  bodyType?: string[]
  category?: string[]
  minPrice?: FormControlValue
  maxPrice?: FormControlValue
  priceRangeGroup?: FormControlValue
  sortBy?: string | FormControlValue
  carModel?: FormControlValue
  phoneNumber?: string
  tenure?: string | number
  isDefaultTenureChanged?: boolean
}

export interface FinancialQuery {
  paymentType?: FormControlValue | string
  downPaymentType?: FormControlValue
  monthlyInstallment?: FormControlValue
  downPaymentAmount?: FormControlValue
  downPaymentPercentage?: FormControlValue
  brand?: string[]
  monthlyIncome?: FormControlValue
  age?: FormControlValue
  bodyType?: string[]
  category?: string[]
  minPrice?: FormControlValue
  maxPrice?: FormControlValue
  priceRangeGroup?: FormControlValue
  sortBy?: string | FormControlValue
  carModel?: FormControlValue
  phoneNumber?: string
  tenure?: string | number
  isDefaultTenureChanged?: boolean
}

export interface PropsBrand {
  name: string
  src: string
  isActive: boolean
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
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

export interface CarModelBasicInfo {
  id: string
  brand: string
  model: string
  promoFlag: boolean
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

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  type: ToastType
  message?: string
  onClose?: () => void
  isDismissible?: boolean
  duration?: number // in seconds
  visible?: boolean
  messageAsComponent?: () => JSX.Element
  overridePositionToBottom?: boolean
}

export interface PropsCapsule {
  item: Location
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export interface PropsIcon {
  width: number
  height: number
  color?: string
  fillColor?: string
  onClick?: () => void
  className?: string
  isActive?: boolean
  datatestid?: string
}

export interface PropsTypeCar {
  name: string
  src: string
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  isActive?: boolean
}

export interface PropsAnnouncementBox {
  data: any
  onCloseButton: (e: React.MouseEvent<HTMLDivElement>) => void
}

export interface PropsArticle {
  data: Array<Article>
}

export interface PropsCategory {
  name: string
  id: number
  isActive: boolean
}

export interface PropsHowToUse {
  title: string
  desc: string
  icon: string
}

export interface PropsFloatingSection {
  onClickImage: (e: React.MouseEvent<HTMLImageElement>) => void
}

export interface PropsSearchMobile {
  onSearchMobileClose: (e: React.MouseEvent<HTMLDivElement>) => void
}

export interface PropsOffering {
  openThankyouModal: () => void
  openLoginModal: () => void
  closeOfferingModal: () => void
}

export interface PropsContactUs {
  openThankyouModal: () => void
  openLoginModal: () => void
}

export interface PropsSelectorList {
  placeholder: string
  onClick: any
  indexKey: string
  isError?: boolean
  fallback?: any
}

export interface PropsButtonTenure {
  tenure: number
  isActive: boolean
}

export interface PropsDetailList {
  data: Array<string | number>
  indexKey: string
  fallback?: any
}

export interface PropsListNavBarMenu {
  menuName: string
  url: string
}

export interface PropsShadow {
  type: string
}

export interface AlephArticleCategoryType {
  label: string
  url: string
  value: string
  testid?: string
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

export interface Option<T extends FormControlValue> {
  label: string
  value: T
  testid?: string
}

export type FormControlValue = string | number | readonly string[] | undefined

export interface OptionWithText<T extends FormControlValue> {
  text?: string
  label: string
  value: T
  testid?: string
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

export interface CityOtrOption {
  cityName: string
  cityCode: string
  province: string
  id?: string
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
}

export interface TabItemData {
  label: string | JSX.Element
  value: string
  testid?: string
}

export interface TabItemProps extends TabItemData {
  isActive: boolean
  onClickHandler?: (value: string) => void
  dataTestId: string
  onPage?: string
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

export type CarResultPageFilterParam = {
  Sort?: string
  Car_Brand?: string | null
  Car_Body_Type?: string | null
  DP?: string | null
  Tenure?: string
  Income?: string | null
  Age?: string | null
  Min_Price?: string
  Max_Price?: string
}

export enum PageOriginationName {
  PLPFloatingIcon = 'PLP Floating Icon',
  PDPLeadsForm = 'PDP Leads Form',
  LPFloatingIcon = 'LP Floating Icon',
  COTMLeadsForm = 'Car Of The Month',
  LPLeadsForm = 'LP Leads Form',
}

export type LeadsActionParam = CarResultPageFilterParam & {
  Page_Origination?: PageOriginationName
  Car_Model?: string
  City?: string
  Peluang_Kredit?: string
}

export interface PropsInput extends React.ComponentProps<'input'> {
  isError?: boolean
  message?: string
  title?: string
  dataTestId?: string
  isWithIcon?: boolean
  icon?: any
}

export interface PropsToast extends Omit<ModalProps, 'closable'> {
  text: string
  closeOnToastClick?: boolean
  width?: number
  typeToast?: 'success' | 'error'
}

export interface PropsModal extends ModalProps {
  children: string | JSX.Element | JSX.Element[]
  isFull?: boolean
}

export enum UTMTags {
  UtmSource = 'utm_source',
  UtmMedium = 'utm_medium',
  UtmCampaign = 'utm_campaign',
  UtmContent = 'utm_content',
  UtmTerm = 'utm_term',
  UtmId = 'utm_id',
  Adset = 'adset',
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

export interface MinMaxPrice {
  maxPriceValue: number
  minPriceValue: number
}

export interface FunnelWidget {
  downPaymentAmount: string
  brand: string[]
  bodyType: string[]
  priceRangeGroup: string
  tenure: string
  age: string
  monthlyIncome: string
}

export interface FinancialFunnelWidgetError {
  downPaymentAmount: string | JSX.Element
  tenure: string
  age: string
  monthlyIncome: string
}
