import getCurrentEnvironment from 'helpers/environments'
const baseUrl = getCurrentEnvironment.apiBaseUrl

const utils = {
  menu: `${baseUrl}/menu`,
  cities: `${baseUrl}/city/fe-selector`,
  testimonials: `${baseUrl}/testimonials`,
  usage: `https://api.sslpots.com/api/how-to-use-seva-config?populate=*`,
  banner: `${baseUrl}/banner-image/homepage`,
  announcementBox: `${baseUrl}/announcement-box`,
  mobileHeaderMenu: `${baseUrl}/menu/mobile-web-top-menu`,
  mobileFooterMenu: `${baseUrl}/menu/mobile-web-bottom-menu`,
  search: `${baseUrl}/cars/search-bar`,
  metaTag:
    'https://api.sslpots.com/api/meta-seos/?filters[master_model][model_code][$contains]=',
  supportedBrowser: '/web-browser/check',
}

const product = {
  recommendation: `${baseUrl}/recommendations/new-funnel`,
  variant: `${baseUrl}/variants`,
  type: `${baseUrl}/cars/body-type-data`,
  carofTheMonth: `${baseUrl}/car-of-the-month`,
  pricing: `${baseUrl}/recommendations/get-price-min-max-by-city`,
  modelDetails: baseUrl + '/models/:id',
  variantDetails: baseUrl + '/variants/:id',
  carVideoReview: baseUrl + '/car-video-review',
}

const leads = {
  unverifiedLeadNew: `${baseUrl}/unverifiedLeads/new`,
}

const auth = {
  user: `${baseUrl}/customers/info`,
  refresh: `${baseUrl}/auth/token`,
  otp: `${baseUrl}/auth/otp`,
  otpVerification: `${baseUrl}/auth/verification`,
}

const article = {
  mainArticle: `https://seva.id/wp-json/foodicious/latest-posts/`,
  subArticle: `https://seva.id/wp-json/seva/latest-posts/`,
}

export const collections = {
  utils,
  product,
  article,
  auth,
  leads,
}
