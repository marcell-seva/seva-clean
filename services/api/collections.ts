const BASE_URL = process.env.NEXT_PUBLIC_API_ROOT || ''
const SEVA_PROD = process.env.NEXT_PUBLIC_SEVA_PROD || ''
const API_SSL = process.env.NEXT_PUBLIC_API_SSL || ''

const utils = {
  menu: `${BASE_URL}/menu`,
  cities: `${BASE_URL}/city/fe-selector`,
  testimonials: `${BASE_URL}/testimonials`,
  usage: `${API_SSL}/api/how-to-use-seva-config?populate=*`,
  banner: `${BASE_URL}/banner-image/homepage`,
  announcementBox: `${BASE_URL}/announcement-box`,
  mobileHeaderMenu: `${BASE_URL}/menu/mobile-web-top-menu`,
  mobileFooterMenu: `${BASE_URL}/menu/mobile-web-bottom-menu`,
  search: `${BASE_URL}/cars/search-bar`,
}

const product = {
  recommendation: `${BASE_URL}/recommendations/new-funnel`,
  variant: `${BASE_URL}/variants`,
  type: `${BASE_URL}/cars/body-type-data`,
  carofTheMonth: `${BASE_URL}/car-of-the-month`,
  pricing: `${BASE_URL}/recommendations/get-price-min-max-by-city`,
}

const leads = {
  unverifiedLeadNew: `${BASE_URL}/unverifiedLeads/new`,
}

const auth = {
  user: `${BASE_URL}/customers/info`,
  refresh: `${BASE_URL}/auth/token`,
  otp: `${BASE_URL}/auth/otp`,
  otpVerification: `${BASE_URL}/auth/verification`,
}

const article = {
  mainArticle: `${SEVA_PROD}/wp-json/foodicious/latest-posts/`,
  subArticle: `${SEVA_PROD}/wp-json/seva/latest-posts/`,
}

export const collections = {
  utils,
  product,
  article,
  auth,
  leads,
}
