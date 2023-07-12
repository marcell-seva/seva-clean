import { logAmplitudeEvent } from 'services/amplitude'
import { TrackingEventName } from './eventTypes'

export type CarResultQuery = {
  downPayment?: number | null
  monthlyInstallment?: number | null
}

export type CarResultParameters = {
  carResultParameters: CarResultQuery
}

type FilterCarResults = CarResultParameters & {
  maxMonthlyInstallments: number | null
  downPayment: number | null
  downPaymentPercentage: number | null
  brands: string[]
}

export type FunnelTrackingEvent =
  // | {
  //     name: TrackingEventName.VIEW_CAR_RESULTS
  //     data: CarResultParameters
  //   }
  // | {
  //     name: TrackingEventName.TAKE_CAR_RESULTS_SURVEY
  //     data: CarResultParameters
  //   }
  // | {
  //     name: TrackingEventName.SEARCH_CAR_RESULTS
  //     data: SearchCarResults
  //   }
  {
    name: TrackingEventName.FILTER_CAR_RESULTS
    data: FilterCarResults
  }
// | {
//     name: TrackingEventName.SELECT_CAR_RESULT
//     data: SelectCarResult
//   }
// | {
//     name: TrackingEventName.SELECT_CAR_RESULT_DETAILS_THUMBNAIL
//     data: SelectCarResultDetailsThumbnail
//   }
// | {
//     name: TrackingEventName.SELECT_CAR_RESULT_VARIANT
//     data: CarResultAndVariantParameterWithVariantIndex
//   }
// | {
//     name: TrackingEventName.SELECT_CAR_RESULT_VARIANT_CALCULATE_LOAN
//     data: CarResultAndVariantParameterWithVariantIndex
//   }
// | {
//     name: TrackingEventName.SELECT_CAR_RESULT_VARIANT_CALCULATE_LOAN_CANCEL
//     data: CarResultAndVariantParameterWithVariantIndex
//   }
// | {
//     name: TrackingEventName.SELECT_CAR_RESULT_VARIANT_CALCULATE_LOAN_START
//     data: CarResultAndVariantParameterWithVariantIndex
//   }
// | {
//     name: TrackingEventName.FILTER_CAR_RESULTS_CANCEL
//     data: null
//   }
// | {
//     name: TrackingEventName.SELECT_CAR_RESULT_VARIANT_DETAILS_THUMBNAIL
//     data: CarResultAndVariantParameterWithVariantIndex
//   }
// | {
//     name: TrackingEventName.SELECT_CAR_RESULT_VARIANT_DETAILS_START_SURVEY
//     data: CarResultAndVariantParameters
//   }
// | {
//     name: TrackingEventName.SELECT_CAR_RESULT_VARIANT_DETAILS_CUSTOMIZE_LOAN
//     data: CarResultAndVariantParameters
//   }
// | {
//     name: TrackingEventName.SELECT_CAR_RESULT_VARIANT_DETAILS_CUSTOMIZE_LOAN_CANCEL
//     data: CarResultAndVariantParameters
//   }
// | {
//     name: TrackingEventName.SELECT_CAR_RESULT_VARIANT_DETAILS_CUSTOMIZE_LOAN_START_SURVEY
//     data: CarResultAndVariantParameters
//   }
// | {
//     name: TrackingEventName.SELECT_CAR_RESULT_VARIANT_DETAILS_SPECIFICATIONS
//     data: CarResultAndVariantParameters
//   }
// | {
//     name: TrackingEventName.SELECT_CAR_RESULT_VARIANT_DETAILS_DESCRIPTION
//     data: CarResultAndVariantParameters
//   }
// | {
//     name: TrackingEventName.SELECT_CAR_RESULT_VARIANT_DETAILS_VIEW_BROCHURE
//     data: CarResultAndVariantParameters
//   }
// | {
//     name: TrackingEventName.SELECT_CAR_RESULT_VARIANT_DETAILS_GET_PREAPPROVAL
//     data: CarResultAndVariantParameters
//   }
// | {
//     name: TrackingEventName.SELECT_CAR_RESULT_VARIANT_DETAILS_GET_PREAPPROVAL_CANCEL
//     data: CarResultAndVariantParameters
//   }
// | {
//     name: TrackingEventName.SELECT_CAR_RESULT_VARIANT_DETAILS_GET_PREAPPROVAL_START
//     data: CarResultAndVariantParameters
//   }
// | {
//     name: TrackingEventName.SELECT_CAR_RESULT_DETAILS_COUPON
//     data: CarResultParameters
//   }
// | {
//     name: TrackingEventName.SELECT_CAR_RESULT_VARIANT_DETAILS_COUPON
//     data: CarResultAndVariantParameters
//   }
// | {
//     name: TrackingEventName.VIEW_CAR_RESULT_VARIANT_DETAILS
//     data: { withLoanCalculator: boolean } & Partial<LoanCalculatorParams>
//   }
// | {
//     name: TrackingEventName.SELECT_COUPON_VALIDATE
//     data: null
//   }

export const trackFilterCarResults = (filterCarResult: FilterCarResults) => {
  logAmplitudeEvent({
    name: TrackingEventName.FILTER_CAR_RESULTS,
    data: filterCarResult,
  })
}
