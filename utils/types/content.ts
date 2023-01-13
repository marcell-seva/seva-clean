import { InstallmentTypeOptions } from '../models/form'
export interface ParagraphBlogType {
  type: string
  body: string
}

export interface PopularBlogType {
  title: string
  writer: string
  date: string
}

export interface RelatedBlogType {
  category: string
  image: string
  title: string
  writer: string
  date: string
}

export interface DataBlogType {
  id: string
  title: string
  writterAndDate: string
  headline: string
  paragraphLists: ParagraphBlogType[]
  popularLists: PopularBlogType[]
  relatedLists: RelatedBlogType[]
}

export type ArticleImageFormat = {
  ext: string
  url: string
  hash: string
  mime: string
  name: string
  path: string
  size: number
  width: number
  height: number
}

export interface ImageAttributes {
  name: string
  alternativeText: string
  caption: string
  width: number
  height: number
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl: string
  provider: string
  provider_metadata: string
  createdAt: string
  updatedAt: string
}

export interface ArticleFeaturedImageAttributes extends ImageAttributes {
  formats: {
    small: ArticleImageFormat
    medium: ArticleImageFormat
    thumbnail: ArticleImageFormat
  }
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

export interface ArticleResponse {
  data: Array<ArticleData>
  meta: ArticleMeta
}

export type ArticleMeta = {
  pagination: {
    page: number
    pageSize: number
    pageCount: number
    total: number
  }
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

export interface FooterSEOData {
  id: number
  attributes: FooterSEOAttributes
}

export interface TestimonialImageAttributes extends ImageAttributes {
  formats: {
    thumbnail: {
      ext: string
      hash: string
      height: number
      mime: string
      name: string
      path: null
      size: number
      url: string
      width: number
    }
  }
}

export interface TestimonialImage {
  data: {
    id: number
    attributes: TestimonialImageAttributes
  }
}

export interface TestimonialData {
  pictureName: string
  pictureUrl: string
  detail: string
  rating: number
  name: string
  age: number
  cityName: string
  purchaseDate: string
  displayNumber: number
}

export interface BannerType {
  desktopImage: string
  mobileImage: string
  url: string
}

export interface SpecialRateRequest {
  otr: number
  dp: number
  dpAmount: number
  monthlyIncome: number
  age: string
  city: string
  discount: number
  rateType?: string
  angsuranType?: InstallmentTypeOptions
  isFreeInsurance?: boolean
}
export interface SpecialRateList {
  tenure?: number
  interestRate?: number
  dp?: number
  dpAmount?: number
  installment?: number
  saveAmount?: number
  loanRank?: string
  totalFirstPayment?: number
}
export interface NavbarItemType {
  label: string
  url: string
  subMenu?: NavbarItemType[]
}

export interface ArticleCategoryType {
  name: string
  isSelected: boolean
  url: string
}

export interface EventActiveType {
  startDateActual: string
  endDateActual: string
  promoCode: string
  giiasName: string
  location: string
  gmapsUrl: string
}

export interface PromoCodeStatusType {
  message: string
  citySelector: {
    id: number
    cityName: string
    cityCode: string
    province: string
    status: boolean
    feSelector: boolean
    paWhitelist: boolean
    insuranceWilayahCode: string
    dsoCityCode: string
  }
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
