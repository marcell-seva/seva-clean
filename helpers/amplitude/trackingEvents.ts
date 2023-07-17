import { LoanRank, PageFrom } from 'utils/models/models'
import { MenuParam, Seva20TrackingEvent } from './seva20Tracking'
import { NewLoanCalculatorTrackingEvent } from './newLoanCalculatorEventTracking'
import { FunnelTrackingEvent } from './newFunnelEventTracking'
import {
  EventFromType,
  NewHomePageTrackingEvent,
  NewHomePageVersion,
} from './newHomePageEventTracking'
import { logAmplitudeEvent } from 'services/amplitude'
import { TrackingEventName } from './eventTypes'
import { TemanSevaTrackingEvent } from './temanSevaEventTracking'

export enum LoanRating {
  Easy = 'easy',
  MaybeDifficult = 'maybe difficult',
  Difficult = 'difficult',
}

export const getLoanRating = (loanRank: string): LoanRating => {
  switch (loanRank) {
    case LoanRank.Green:
      return LoanRating.Easy
    case LoanRank.Yellow:
      return LoanRating.MaybeDifficult
    case LoanRank.Red:
      return LoanRating.Difficult
    default:
      return LoanRating.Easy
  }
}

export type TrackingEvent =
  | {
      name: TrackingEventName.SEND_WHATSAPP_MESSAGE
      data: {
        carModel: string
        downPayment: string
        monthlyInstallment: string
        pageFrom: PageFrom
        variantName?: string
      }
    }
  | {
      name: TrackingEventName.SELECT_LANGUAGE
      data: { language: string }
    }
  | Seva20TrackingEvent
  | NewLoanCalculatorTrackingEvent
  | FunnelTrackingEvent
  | NewHomePageTrackingEvent
  | TemanSevaTrackingEvent

export const trackWhatsappButtonClickFromCarResults = (
  from: EventFromType,
  carModel: string,
  downPayment: string,
  monthlyInstallment: string,
  pageFrom: PageFrom,
  variantName?: string,
  version?: NewHomePageVersion,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.SEND_WHATSAPP_MESSAGE,
    data: {
      from,
      carModel,
      downPayment,
      monthlyInstallment,
      pageFrom,
      variantName,
      version,
    },
  } as any)
}

export const trackSelectLanguage = (language: string) => {
  logAmplitudeEvent({
    name: TrackingEventName.SELECT_LANGUAGE,
    data: {
      language,
    },
  })
}
