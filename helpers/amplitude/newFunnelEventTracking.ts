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

export type FunnelTrackingEvent = {
  name: TrackingEventName.SELECT_CAR_RESULT_VARIANT_DETAILS_VIEW_BROCHURE
  data: CarResultAndVariantParameters
}

export const trackSelectCarResultVariantDetailsViewBrochure = (
  selectCarResultVariant: CarResultAndVariantParameters,
) => {
  logAmplitudeEvent({
    name: TrackingEventName.SELECT_CAR_RESULT_VARIANT_DETAILS_VIEW_BROCHURE,
    data: selectCarResultVariant,
  })
}
