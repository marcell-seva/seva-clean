import { TrackingEventName } from './eventTypes'

export enum NewHomePageVersion {
  standard = 'standard',
  phone = 'with_phone_field',
}

type NewHomePageVersionParam = {
  version: NewHomePageVersion
}

export enum EventFromType {
  home = 'home',
  search = 'search',
  searchPhone = 'search_phone',
  carResults = 'car_results',
  carResultDetails = 'car_result_details',
  carResultVariant = 'car_result_variant',
}

export type NewHomePageTrackingEvent = {
  name: TrackingEventName.SEND_WHATSAPP_MESSAGE
  data: NewHomePageVersionParam & {
    from: EventFromType
  }
}
