import urls from 'helpers/urls'
import { TrackingEventName, TrackingEventWebNavigation } from './eventTypes'
import { trackHeaderNavigationMenuClick } from './seva20Tracking'

const EventTrackingBrand = (brandCode: string) => {
  switch (brandCode) {
    case 'toyota':
      return TrackingEventName.WEB_NAVIGATION_MEREK_TOYOTA_CLICK
    case 'daihatsu':
      return TrackingEventName.WEB_NAVIGATION_MEREK_DAIHATSU_CLICK
    case 'BMW':
      return TrackingEventName.WEB_NAVIGATION_MEREK_BMW_CLICK
    case 'isuzu':
      return TrackingEventName.WEB_NAVIGATION_MEREK_ISUZU_CLICK
    case 'peugeot':
      return TrackingEventName.WEB_NAVIGATION_MEREK_PEUGEOT_CLICK
  }
}

const EventTrackingArticleName = (code: string) => {
  switch (code) {
    case 'berita-otomotif':
      return TrackingEventName.WEB_NAVIGATION_ARTICLE_BERITA_OTOMOTIF_CLICK
    case 'review-mobil':
      return TrackingEventName.WEB_NAVIGATION_ARTICLE_REVIEW_MOBIL_CLICK
    case 'tips-tutorial':
      return TrackingEventName.WEB_NAVIGATION_ARTICLE_TIPS_REKOMENDASI_CLICK
    case 'jasa-keuangan':
      return TrackingEventName.WEB_NAVIGATION_ARTICLE_KEUANGAN_CLICK
    case 'semua-artikel':
      return TrackingEventName.WEB_NAVIGATION_ARTICLE_ALL_CLICK
  }
}

const EventTrackingLainnyaName = (code: string) => {
  switch (code) {
    case 'facebook':
      return TrackingEventName.WEB_NAVIGATION_FACEBOOK_CLICK
    case 'twitter':
      return TrackingEventName.WEB_NAVIGATION_TWITTER_CLICK
    case 'instagram':
      return TrackingEventName.WEB_NAVIGATION_INSTAGRAM_CLICK
    case 'hubungi-kami':
      return TrackingEventName.WEB_NAVIGATION_HUBUNGI_KAMI_CLICK
  }
}

export const EventTrackingFooterName = (url: string) => {
  switch (url) {
    case urls.about:
      return TrackingEventName.WEB_FOOTER_TENTANGKAMI
    case urls.contactUs:
      return TrackingEventName.WEB_FOOTER_HUBUNGIKAMI
    case urls.termsAndConditionsSeva:
      return TrackingEventName.WEB_FOOTER_SYARATKETENTUAN
    case urls.privacyPolicySeva:
      return TrackingEventName.WEB_FOOTER_KEBIJAKANPRIVASI
  }
}

export const handleEventTrackingBeliMobile = (brandCode: string) => {
  const nameEventTrackingBrand = EventTrackingBrand(
    brandCode,
  ) as TrackingEventWebNavigation
  trackHeaderNavigationMenuClick(nameEventTrackingBrand)
}

export const handleEventTrackingArticle = (articleCode: string) => {
  const eventTrackingName = EventTrackingArticleName(
    articleCode,
  ) as TrackingEventWebNavigation
  trackHeaderNavigationMenuClick(eventTrackingName)
}

export const handleEventTrackingLainnya = (code: string) => {
  const eventTrackingName = EventTrackingLainnyaName(
    code,
  ) as TrackingEventWebNavigation
  trackHeaderNavigationMenuClick(eventTrackingName)
}
