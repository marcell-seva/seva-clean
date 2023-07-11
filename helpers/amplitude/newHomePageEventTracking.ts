import { TrackingEventName } from './eventTypes'
import { logAmplitudeEvent } from 'services/amplitude'
import {
  AdVariation,
  SupportedBrand,
  VariantBodyType,
} from 'utils/models/models'

export enum NewHomePageVersion {
  standard = 'standard',
  phone = 'with_phone_field',
}

type NewHomePageVersionParam = {
  version: NewHomePageVersion
}

type NewHomePagePopularCarsParams = {
  index: number
  carID: string
  carName: string
  price: string
}

export enum EventFromType {
  home = 'home',
  search = 'search',
  searchPhone = 'search_phone',
  carResults = 'car_results',
  carResultDetails = 'car_result_details',
  carResultVariant = 'car_result_variant',
}

export type NewHomePageTrackingEvent =
  // | {
  //     name: TrackingEventName.SELECT_HOME_BRAND
  //     data: NewHomePageVersionParam & { brand: SupportedBrand }
  //   }
  // | {
  //     name: TrackingEventName.SELECT_HOME_BODY_TYPE
  //     data: NewHomePageVersionParam & { bodyType: VariantBodyType }
  //   }
  // | {
  //     name: TrackingEventName.SELECT_HOME_POPULAR_CARS
  //     data: NewHomePageVersionParam & NewHomePagePopularCarsParams
  //   }
  // | {
  //     name: TrackingEventName.NAVIGATE_HOME_POPULAR_CARS
  //     data: NewHomePageVersionParam & { index: number }
  //   }
  // | {
  //     name: TrackingEventName.SELECT_HOME_BROWSE
  //     data: NewHomePageVersionParam
  //   }
  // | {
  //     name: TrackingEventName.SELECT_HOME_START_SURVEY
  //     data: NewHomePageVersionParam
  //   }
  // | {
  //     name: TrackingEventName.SELECT_HOME_FIND_OUT_MORE
  //     data: NewHomePageVersionParam
  //   }
  // | {
  //     name: TrackingEventName.NAVIGATE_HOME_PROMOS
  //     data: NewHomePageVersionParam & { index: number }
  //   }
  // | {
  //     name: TrackingEventName.SELECT_HOME_TERMS
  //     data: NewHomePageVersionParam
  //   }
  // | {
  //     name: TrackingEventName.SELECT_HOME_PRIVACY
  //     data: NewHomePageVersionParam
  //   }
  // | {
  //     name: TrackingEventName.SELECT_HOME_CONTACT
  //     data: NewHomePageVersionParam
  //   }
  // | {
  //     name: TrackingEventName.VIEW_HOME
  //     data: NewHomePageVersionParam & {
  //       ad: AdVariation
  //       from: EventFromType
  //     }
  //   }
  // | {
  //     name: TrackingEventName.HOME_CTA
  //     data: NewHomePageVersionParam & {
  //       ad: AdVariation
  //       from: EventFromType
  //     }
  //   }
  {
    name: TrackingEventName.SELECT_HOME_SEND_DETAILS
    data: NewHomePageVersionParam
  }
// | {
//     name: TrackingEventName.SEND_WHATSAPP_MESSAGE
//     data: NewHomePageVersionParam & {
//       from: EventFromType
//     }
//   }

// export const trackSelectHomeBanner = (
//   brand: SupportedBrand,
//   version: NewHomePageVersion = NewHomePageVersion.standard,
// ) => {
//   logAmplitudeEvent({
//     name: TrackingEventName.SELECT_HOME_BRAND,
//     data: { brand, version },
//   })
// }

// export const trackSelectHomeBodyType = (
//   bodyType: VariantBodyType,
//   version: NewHomePageVersion = NewHomePageVersion.standard,
// ) => {
//   logAmplitudeEvent({
//     name: TrackingEventName.SELECT_HOME_BODY_TYPE,
//     data: { bodyType, version },
//   })
// }

// export const trackSelectHomePopularCars = (
//   { index, ...rest }: NewHomePagePopularCarsParams,
//   version: NewHomePageVersion = NewHomePageVersion.standard,
// ) => {
//   logAmplitudeEvent({
//     name: TrackingEventName.SELECT_HOME_POPULAR_CARS,
//     data: { index: index + 1, ...rest, version },
//   })
// }

// export const trackNavigateHomePopularCars = (
//   index: number,
//   version: NewHomePageVersion = NewHomePageVersion.standard,
// ) => {
//   logAmplitudeEvent({
//     name: TrackingEventName.NAVIGATE_HOME_POPULAR_CARS,
//     data: { index: index + 1, version },
//   })
// }

// export const trackSelectHomeBrowseMore = (
//   version: NewHomePageVersion = NewHomePageVersion.standard,
// ) => {
//   logAmplitudeEvent({
//     name: TrackingEventName.SELECT_HOME_BROWSE,
//     data: { version },
//   })
// }

// export const trackSelectHomeStartSurvey = (
//   version: NewHomePageVersion = NewHomePageVersion.standard,
// ) => {
//   logAmplitudeEvent({
//     name: TrackingEventName.SELECT_HOME_START_SURVEY,
//     data: { version },
//   })
// }

// export const trackSelectHomeFindOutMore = (
//   version: NewHomePageVersion = NewHomePageVersion.standard,
// ) => {
//   logAmplitudeEvent({
//     name: TrackingEventName.SELECT_HOME_FIND_OUT_MORE,
//     data: { version },
//   })
// }

// export const trackNavigateHomePromos = (
//   index: number,
//   version: NewHomePageVersion = NewHomePageVersion.standard,
// ) => {
//   logAmplitudeEvent({
//     name: TrackingEventName.NAVIGATE_HOME_PROMOS,
//     data: { index: index + 1, version },
//   })
// }

// export const trackSelectHomeTerms = (
//   version: NewHomePageVersion = NewHomePageVersion.standard,
// ) => {
//   logAmplitudeEvent({
//     name: TrackingEventName.SELECT_HOME_TERMS,
//     data: { version },
//   })
// }

// export const trackSelectHomePrivacy = (
//   version: NewHomePageVersion = NewHomePageVersion.standard,
// ) => {
//   logAmplitudeEvent({
//     name: TrackingEventName.SELECT_HOME_PRIVACY,
//     data: { version },
//   })
// }

// export const trackSelectHomeContact = (
//   version: NewHomePageVersion = NewHomePageVersion.standard,
// ) => {
//   logAmplitudeEvent({
//     name: TrackingEventName.SELECT_HOME_CONTACT,
//     data: { version },
//   })
// }

// export const trackViewHome = (
//   from: EventFromType,
//   ad: AdVariation,
//   version: NewHomePageVersion = NewHomePageVersion.standard,
// ) => {
//   logAmplitudeEvent({
//     name: TrackingEventName.VIEW_HOME,
//     data: { version, ad, from },
//   })
// }

// export const trackHomeCTA = (
//   from: EventFromType,
//   ad: AdVariation,
//   version: NewHomePageVersion = NewHomePageVersion.standard,
// ) => {
//   logAmplitudeEvent({
//     name: TrackingEventName.HOME_CTA,
//     data: { version, ad, from },
//   })
// }

export const trackSelectHomeSendDetails = (
  version: NewHomePageVersion = NewHomePageVersion.standard,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.SELECT_HOME_SEND_DETAILS,
    data: { version },
  })
}

// export const trackSelectWhatsApp = (
//   from: EventFromType,
//   version: NewHomePageVersion = NewHomePageVersion.standard,
// ) => {
//   logAmplitudeEvent({
//     name: TrackingEventName.SEND_WHATSAPP_MESSAGE,
//     data: { version, from },
//   })
// }
