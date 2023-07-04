const utils = {
  menu: 'https://api.seva.id/menu',
  cities: 'https://api.seva.id/city/fe-selector',
  testimonials: 'https://api.seva.id/testimonials',
  usage: 'https://api.sslpots.com/api/how-to-use-seva-config?populate=*',
  banner: 'https://api.seva.id/banner-image/homepage',
  announcementBox: 'https://api.seva.id/announcement-box',
  mobileHeaderMenu: 'https://api.seva.id/menu/mobile-web-top-menu',
  mobileFooterMenu: 'https://api.seva.id/menu/mobile-web-bottom-menu',
}

const product = {
  recommendation: 'https://api.seva.id/recommendations/new-funnel',
  variant: 'https://api.seva.id/variants',
  type: 'https://api.seva.id/cars/body-type-data',
  carofTheMonth: 'https://api.seva.id/car-of-the-month',
  pricing: 'https://api.seva.id/recommendations/get-price-min-max-by-city',
}

const leads = {
  unverifiedLeadNew: 'https://api.seva.id/unverifiedLeads/new',
}

const auth = {
  user: 'https://api.seva.id/customers/info',
  refresh: 'https://api.seva.id/auth/token',
  otp: 'https://api.seva.id/auth/otp',
  otpVerification: 'https://api.seva.id/auth/verification',
}

const article = {
  mainArticle: 'https://www.seva.id/wp-json/foodicious/latest-posts/',
  subArticle: 'https://www.seva.id/wp-json/seva/latest-posts/',
}

export const collections = {
  utils,
  product,
  article,
  auth,
  leads,
}
