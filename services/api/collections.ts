import getCurrentEnvironment from 'helpers/environments'

// TEMPORARY
// TODO : implement .env file (migrate all variable from "environtments.ts")
const baseUrl = getCurrentEnvironment.apiBaseUrl

const utils = {
  menu: baseUrl + '/menu',
  cities: baseUrl + '/city/fe-selector',
  testimonials: baseUrl + '/testimonials',
  usage: 'https://api.sslpots.com/api/how-to-use-seva-config?populate=*',
  banner: baseUrl + '/banner-image/homepage',
  announcementBox: baseUrl + '/announcement-box',
  metaTag:
    'https://api.sslpots.com/api/meta-seos/?filters[master_model][model_code][$contains]=',
  supportedBrowser: '/web-browser/check',
}

const product = {
  recommendation: baseUrl + '/recommendations/new-funnel',
  modelDetails: baseUrl + '/models/:id',
  variantDetails: baseUrl + '/variants/:id',
  variant: baseUrl + '/variants',
  type: baseUrl + '/cars/body-type-data',
  carofTheMonth: baseUrl + '/car-of-the-month',
  carVideoReview: baseUrl + '/car-video-review',
}

const auth = {
  user: baseUrl + '/customers/info',
  refresh: baseUrl + '/auth/token',
}

const article = {
  mainArticle: 'https://www.seva.id/wp-json/foodicious/latest-posts/',
  subArticle: 'https://www.seva.id/wp-json/seva/latest-posts/',
}

const leads = {
  unverified: baseUrl + '/unverifiedLeads',
}

export const collections = {
  utils,
  product,
  article,
  auth,
  leads,
}
