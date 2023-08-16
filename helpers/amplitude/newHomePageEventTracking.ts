import { TrackingEventName } from './eventTypes'
import { logAmplitudeEvent } from 'services/amplitude'

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
  | {
      name: TrackingEventName.SEND_WHATSAPP_MESSAGE
      data: NewHomePageVersionParam & {
        from: EventFromType
      }
    }
  | {
      name: TrackingEventName.SELECT_HOME_SEND_DETAILS
      data: NewHomePageVersionParam
    }

export const trackSelectHomeSendDetails = (
  version: NewHomePageVersion = NewHomePageVersion.standard,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.SELECT_HOME_SEND_DETAILS,
    data: { version },
  })
}
