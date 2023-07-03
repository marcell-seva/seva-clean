import {
  ContactType,
  LoanRank,
  UnverifiedLeadSubCategory,
  UTMTags,
} from 'utils/enum'

export type FormControlValue = string | number | readonly string[] | undefined

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

export interface Time {
  hours: string
  minutes: string
  seconds: string
}
export interface Location {
  cityName: string
  cityCode: string
  id: number | string
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

export interface HowToUse {
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
