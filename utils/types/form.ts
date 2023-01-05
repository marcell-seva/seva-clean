import { InstallmentTypeOptions } from '../models/form'
import { LoanRank } from '../models/product'
export type FormControlValue = string | number | readonly string[] | undefined

export interface Option<T extends FormControlValue> {
  label: string
  value: T
}

export interface CustomOption<T extends FormControlValue> {
  label: string | JSX.Element | Element
  value: T
  text: string
}

export interface SPKFormType {
  spkNo: string
  brand: string
  model: string
  variant: string
  salesDealerQr: string
  salesFincoQr?: string
  phoneNumber: string
  fullName: string
  ktpNo: string
  leasingPartner: string
  dpAmount: number
  installmentType: InstallmentTypeOptions
  qty: number
}

export interface SPKRequestForm extends SPKFormType {
  priceOtr: number
  isParticipate: boolean
  dpPercentage: number
  promo?: Array<string | null>
}

export interface CalculateSPKType {
  loanTenure: number
  loanRate: number
  tpp: number
  loanMonthlyInstallment: number
}

export interface SPKFormSubmission extends SPKRequestForm, CalculateSPKType {
  isAlreadyIA: boolean
}

export interface CustomerRegister {
  phoneNumber: string
  fullName: string
  gender: string
  dob: string
  email: string
  promoSubscription: boolean
  marital: string
  referralCode?: string
}

export interface PreapprovalDataType {
  phoneNumber?: string
  occupation: string
  totalIncome: string
  province: string
  city: string
  zipCode: string
  email: string
}

export interface CheckInDataType {
  buChoice: string
  fullName: string
  phoneNumber: string
  email: string
  attendaceDate: string
  attendaceTime: string
  crmCheckinCode: string
}

export interface SalesmanRegisteredDataType {
  fullName: string
  phoneNumber: string
  branch: string
  npk: string
  salesCode: string
}

export interface SalesmanRegistertrationDataType {
  salesName: string
  phoneNo: string
  branchCode: string
  salesCodeNpk: string
  salesQrcode: string
  branchNameText?: string
}

export interface CustomerInfoSeva {
  id: number
  phoneNumber: string
  fullName: string
  gender: string
  dob: string
  email: string
  marital: string
  registType: string
  isSales: boolean
  isCrmCustomer: boolean
  createdAt?: string
}

export interface PreApprovalRequest {
  monthlyIncome: number
  loanTenure?: number
  loanDownPayment?: number
  loanMonthlyInstallment?: number
  loanRank?: LoanRank
  variantId?: string
  modelId?: string
  address: {
    city: FormControlValue
    province: FormControlValue
    zipCode: string
  }
  occupation: FormControlValue
  email: string
}

export interface PreApprovalExternalRequest extends PreApprovalRequest {
  phoneNumber: string
  totalFirstPayment: number
  flatRate: number
  carName: string
  carType: string
  paPriceOtr: number
  angsuranType: string
  rateType: string
  companyName: string
  iaExternalUuid: string
}
