import { NewFunnelLoanRank } from 'utils/models/models'
import { TrackingEventName } from './eventTypes'
import {
  LoanCalculatorParams,
  LoanCalculatorParamsWithoutLoanRating,
} from './newFunnelEventTracking'
import { logAmplitudeEvent } from 'services/amplitude'
import { LoanRating, getLoanRating } from './trackingEvents'

type LoanCalcRecommendationParams = {
  index: number
  carID: string
  carName: string
  price: string
  loanRating: LoanRating
  monthlyInstallments: string
  downPayment: string
}

export type LoanCalcRecommendationParamsWithoutLoanRating = Omit<
  LoanCalcRecommendationParams,
  'loanRating'
>

export type NewLoanCalculatorTrackingEvent =
  | {
      name: TrackingEventName.VIEW_V2_LOAN_CALCULATOR_SURVEY
      data: { from: 'car_result_details' | 'car_result_variant' }
    }
  | {
      name: TrackingEventName.SELECT_V2_LOAN_CALCULATOR_SURVEY_CALCULATE
      data: { income: number; age: string }
    }
  | {
      name: LoanCalcV2AmplitudeEvents
      data: LoanCalculatorParams
    }
  | {
      name: TrackingEventName.SELECT_V2_LOAN_CALCULATOR_RECOMMENDATION
      data: LoanCalcRecommendationParams
    }

export const trackViewV2LoanCalculatorSurvey = (
  from: 'car_result_details' | 'car_result_variant',
) => {
  logAmplitudeEvent({
    name: TrackingEventName.VIEW_V2_LOAN_CALCULATOR_SURVEY,
    data: { from },
  })
}

export const tracSelectV2LoanCalculatorSurveyCalculate = (params: {
  income: number
  age: string
}) => {
  logAmplitudeEvent({
    name: TrackingEventName.SELECT_V2_LOAN_CALCULATOR_SURVEY_CALCULATE,
    data: params,
  })
}

export const tracViewV2LoanCalculator = (
  params: LoanCalculatorParamsWithoutLoanRating & {
    loanRank: NewFunnelLoanRank
  },
) => {
  logLoanCalcV2AmplitudeEvent(TrackingEventName.VIEW_V2_LOAN_CALCULATOR, params)
}

export const tracSelectV2LoanCalculatorValues = (
  params: LoanCalculatorParamsWithoutLoanRating & {
    loanRank: NewFunnelLoanRank
  },
) => {
  logLoanCalcV2AmplitudeEvent(
    TrackingEventName.SELECT_V2_LOAN_CALCULATOR_VALUES,
    params,
  )
}

export const tracSelectV2LoanCalculatorEdit = (
  params: LoanCalculatorParamsWithoutLoanRating & {
    loanRank: NewFunnelLoanRank
  },
) => {
  logLoanCalcV2AmplitudeEvent(
    TrackingEventName.SELECT_V2_LOAN_CALCULATOR_EDIT,
    params,
  )
}

export const tracSelectV2LoanCalculatorSpeak = (
  params: LoanCalculatorParamsWithoutLoanRating & {
    loanRank: NewFunnelLoanRank
  },
) => {
  logLoanCalcV2AmplitudeEvent(
    TrackingEventName.SELECT_V2_LOAN_CALCULATOR_SPEAK,
    params,
  )
}

export const tracSelectV2LoanCalculatorSelect = (
  params: LoanCalculatorParamsWithoutLoanRating & {
    loanRank: NewFunnelLoanRank
  },
) => {
  logLoanCalcV2AmplitudeEvent(
    TrackingEventName.SELECT_V2_LOAN_CALCULATOR_SELECT,
    params,
  )
}

export const tracSelectV2LoanCalculatorGetApproval = (
  params: LoanCalculatorParamsWithoutLoanRating & {
    loanRank: NewFunnelLoanRank
  },
) => {
  logLoanCalcV2AmplitudeEvent(
    TrackingEventName.SELECT_V2_LOAN_CALCULATOR_GET_PREAPPROVED,
    params,
  )
}

export const tracSelectV2LoanCalculatorRecommendation = (
  params: LoanCalcRecommendationParamsWithoutLoanRating & {
    loanRank: NewFunnelLoanRank
  },
) => {
  const { loanRank, index, ...rest } = params
  logAmplitudeEvent({
    name: TrackingEventName.SELECT_V2_LOAN_CALCULATOR_RECOMMENDATION,
    data: {
      ...rest,
      index: index + 1,
      loanRating: getLoanRating(loanRank),
    },
  })
}

type LoanCalcV2AmplitudeEvents =
  | TrackingEventName.SELECT_V2_LOAN_CALCULATOR_VALUES
  | TrackingEventName.SELECT_V2_LOAN_CALCULATOR_EDIT
  | TrackingEventName.VIEW_V2_LOAN_CALCULATOR
  | TrackingEventName.SELECT_V2_LOAN_CALCULATOR_SPEAK
  | TrackingEventName.SELECT_V2_LOAN_CALCULATOR_SELECT
  | TrackingEventName.SELECT_V2_LOAN_CALCULATOR_GET_PREAPPROVED

const logLoanCalcV2AmplitudeEvent = (
  event: LoanCalcV2AmplitudeEvents,
  params: LoanCalculatorParamsWithoutLoanRating & {
    loanRank: NewFunnelLoanRank
  },
) => {
  const { loanRank, ...rest } = params
  logAmplitudeEvent({
    name: event,
    data: {
      ...rest,
      loanRating: getLoanRating(loanRank),
    },
  })
}
