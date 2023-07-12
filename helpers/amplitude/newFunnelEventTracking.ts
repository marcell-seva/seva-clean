import { logAmplitudeEvent } from 'services/amplitude'
import { TrackingEventName } from './eventTypes'
import { LoanRating } from './trackingEvents'

export type CarResultQuery = {
  downPayment?: number | null
  monthlyInstallment?: number | null
}

export type CarResultParameters = {
  carResultParameters: CarResultQuery
}
type CarVariantParameters = {
  variantID: string
  variantName: string
  variantPrice: string | number
  variantMonthlyInstallments: number
  variantDownPayment: number
  variantTenure: string | number
}
export type CarResultAndVariantParameters = CarResultParameters &
  CarVariantParameters

export type SearchCarResults = CarResultParameters & { search: string }

export type LoanCalculatorParams = {
  loanRating: LoanRating
  income: number
  age: string
  monthlyInstallments: number
  downPayment: number
  tenure: number
}

export type LoanCalculatorParamsWithoutLoanRating = Omit<
  LoanCalculatorParams,
  'loanRating'
>

export type FunnelTrackingEvent =
  | {
      name: TrackingEventName.SELECT_CAR_RESULT_VARIANT_DETAILS_VIEW_BROCHURE
      data: CarResultAndVariantParameters
    }
  | {
      name: TrackingEventName.FILTER_CAR_RESULTS
      data: FilterCarResults
    }
  | {
      name: TrackingEventName.VIEW_CAR_RESULTS
      data: CarResultParameters
    }
  | {
      name: TrackingEventName.SEARCH_CAR_RESULTS
      data: SearchCarResults
    }

export const trackSelectCarResultVariantDetailsViewBrochure = (
  selectCarResultVariant: CarResultAndVariantParameters,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.SELECT_CAR_RESULT_VARIANT_DETAILS_VIEW_BROCHURE,
    data: selectCarResultVariant,
  })
}

type FilterCarResults = CarResultParameters & {
  maxMonthlyInstallments: number | null
  downPayment: number | null
  downPaymentPercentage: number | null
  brands: string[]
}

export const trackFilterCarResults = (filterCarResult: FilterCarResults) => {
  logAmplitudeEvent({
    name: TrackingEventName.FILTER_CAR_RESULTS,
    data: filterCarResult,
  })
}

export const trackViewCarResult = (
  carResultParameters: CarResultParameters,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.VIEW_CAR_RESULTS,
    data: carResultParameters,
  })
}

export const trackSearchCarResults = (searchCarResults: SearchCarResults) => {
  logAmplitudeEvent({
    name: TrackingEventName.SEARCH_CAR_RESULTS,
    data: searchCarResults,
  })
}
