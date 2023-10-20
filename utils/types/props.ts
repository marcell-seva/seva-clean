import { FormControlValue, Location } from './utils'
import { HTMLAttributes } from 'react'
import { LoanRank, ToastType } from './models'
import type { ModalProps } from 'antd'
import { InputVersionType } from 'utils/enum'

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
export interface MobileWebFooterMenuType {
  menuCode: string
  menuDesc: string
  menuLevel: number
  menuName: string
  menuOrder: number
  menuType: string
  menuUrl: string
  status: boolean
  toggleNew: boolean
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
  width?: number
  height?: number
  color?: string
  fillColor?: string
  onClick?: () => void
  className?: string
  isActive?: boolean
  datatestid?: string
  alt?: string
}

export interface PropsInput extends React.ComponentProps<'input'> {
  isError?: boolean
  message?: string
  title?: string
  dataTestId?: string
  isWithIcon?: boolean
  icon?: any
  version?: InputVersionType
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

export interface PropsToast extends Omit<ModalProps, 'closable'> {
  text: string
  closeOnToastClick?: boolean
  width?: number
  typeToast?: 'success' | 'error'
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

export interface PropsField {
  title: string
  data: string
  isLastIndex?: boolean
}

export interface PropsFieldDetail {
  title: string
  data: Array<{
    key: string
    value: string | number
  }>
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

export interface PropsBannerCard {
  title: string
  subTitle: string
  icon: JSX.Element
  onClick?: () => void
  isWithoutClick?: boolean
  children?: any
}

export interface PropsInputDate
  extends React.ComponentPropsWithoutRef<'input'> {
  title?: string
  dataTestId?: string
  isError?: boolean
  message?: string
  showValueAs?: string
}
