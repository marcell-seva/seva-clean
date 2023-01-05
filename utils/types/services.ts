import { CityOtrOption } from 'pages/component/CityOtrDropDown/CityOtrDropDown'
import { UTMTags, WebviewMessageType } from '../models/services'
import { CustomerPreApprovalStatus } from '../models/form'
import {
  LoanRank,
  NewFunnelLoanPermutationsKey,
  NewFunnelLoanPermutationsKeySeva,
} from '../models/product'
export interface ErrorResponse {
  code?: string
  message: string
  details?: Record<string, unknown>
}

export interface ErrorValidationDetail {
  name: string
  message: string
}

export interface UTMTagsData {
  [UTMTags.UtmSource]: string | null
  [UTMTags.UtmMedium]: string | null
  [UTMTags.UtmCampaign]: string | null
  [UTMTags.UtmContent]: string | null
  [UTMTags.UtmTerm]: string | null
  [UTMTags.UtmId]: string | null
  [UTMTags.Adset]: string | null
}

export type WebviewMessageData<T> = {
  type: WebviewMessageType
  value: T
}

export interface Params {
  id: string
}

export interface NewFunnelLoanPermutations {
  [NewFunnelLoanPermutationsKey.DpAmount]: number
  [NewFunnelLoanPermutationsKey.LoanRank]: string
  [NewFunnelLoanPermutationsKey.MonthlyInstallment]: number
  [NewFunnelLoanPermutationsKey.Tenure]: number
  [NewFunnelLoanPermutationsKey.DpPercentage]: number
  isDefault?: boolean
}

export interface NewFunnelLoanPermutationsSeva {
  [NewFunnelLoanPermutationsKeySeva.DpAmount]: number
  [NewFunnelLoanPermutationsKeySeva.LoanRankSeva]: string
  [NewFunnelLoanPermutationsKeySeva.MonthlyInstallment]: number
  [NewFunnelLoanPermutationsKeySeva.Tenure]: number
  [NewFunnelLoanPermutationsKeySeva.DpPercentage]: number
  isDefault?: boolean
}
export interface NewFunnelLoanPermutationsRequest {
  id: string
  monthlyIncome: number
  age: string
}

export interface NewFunnelLoanPermutationsResponse {
  loanPermutations: NewFunnelLoanPermutations[]
}

export interface NewFunnelLoanPermutationsSevaResponse {
  loanPermutations: NewFunnelLoanPermutationsSeva[]
}
export type NewFunnelLoanRankName = {
  name: NewFunnelLoanPermutationsKey
  value: string
}

export interface MetaTagApiResponse {
  id: number
  attributes: {
    meta_title: string
    meta_description: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    location_page3: string
  }
}

export interface SMSResponse {
  message: string
  lastOtpSentTime: number
}
export interface Token {
  idToken: string
  refreshToken: string
  expiresIn: string
  localId: string
  isNewUser: boolean
  phoneNumber: string
}

export interface Time {
  hours: string
  minutes: string
  seconds: string
}

export interface QuestionFlowFormAddressProps {
  handleDisabled?: (isDataValid: boolean) => void
  citiesFromApi: CityOtrOption[]
}

export interface QuestionFlowFormProps {
  handleDisabled?: (isDataValid: boolean) => void
}
