import { logAmplitudeEvent } from 'services/amplitude'
import { TrackingEventName } from './eventTypes'

export type TemanSevaTrackingEvent =
  // | {
  //     name: TrackingEventName.WEB_TEMAN_SEVA_REGISTRATION_PAGE_VIEW
  //     data: null
  //   }
  // | {
  //     name: TrackingEventName.WEB_TEMAN_SEVA_REGISTRATION_SUCCESS_PAGE_VIEW
  //     data: null
  //   }
  // | {
  //     name: TrackingEventName.WEB_TEMAN_SEVA_DASHBOARD_PAGE_VIEW
  //     data: null
  //   }
  {
    name: TrackingEventName.WEB_BURGER_MENU_CLICK_TEMAN_SEVA
    data: null
  }

// export const trackTemanSevaRegistrationPageView = () => {
//   logAmplitudeEvent({
//     name: TrackingEventName.WEB_TEMAN_SEVA_REGISTRATION_PAGE_VIEW,
//     data: null,
//   })
// }
// export const trackTemanSevaRegistrationSuccessPageView = () => {
//   logAmplitudeEvent({
//     name: TrackingEventName.WEB_TEMAN_SEVA_REGISTRATION_SUCCESS_PAGE_VIEW,
//     data: null,
//   })
// }
// export const trackTemanSevaDashboardPageView = () => {
//   logAmplitudeEvent({
//     name: TrackingEventName.WEB_TEMAN_SEVA_DASHBOARD_PAGE_VIEW,
//     data: null,
//   })
// }
export const trackBurgerMenuClickTemanSeva = () => {
  logAmplitudeEvent({
    name: TrackingEventName.WEB_BURGER_MENU_CLICK_TEMAN_SEVA,
    data: null,
  })
}
