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
