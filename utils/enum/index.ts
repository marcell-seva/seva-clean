export type PickEnum<T, K extends T> = {
  [P in keyof K]: P extends K ? P : never
}

export enum LanguageCode {
  en = 'en',
  id = 'id',
}

export enum LoanRank {
  Green = 'Green',
  Red = 'Red',
}

export enum Environment {
  Localhost = 'localhost',
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
}

export enum ButtonVersion {
  Secondary = 'Secondary',
  SecondaryDark = 'SecondaryDark',
  PrimaryDarkBlue = 'PrimaryDarkBlue',
  Disable = 'Disable',
  Default = 'Default',
}

export enum ButtonSize {
  Big = 'Big',
  Small = 'Small',
}

export enum InputVersion {
  Default = 'Default',
  Mobile = 'Mobile',
}

export enum MinAmount {
  downPaymentAmount = 20000000,
  monthlyIncome = 3000000,
}

export enum PaymentType {
  MonthlyInstallment = 'monthlyInstallment',
  DownPayment = 'downPayment',
  CarModel = 'carModel',
}

export enum DownPaymentType {
  DownPaymentAmount = 'amount',
  DownPaymentPercentage = 'percentage',
}

export enum LocalStorageKey {
  TempLoginPhone = 'tempLoginPhone',
  ColorNotificationModalShown = 'colorNotificationModalShown',
  Language = 'language',
  SurveyForm = 'surveyForm',
  CurrentStep = 'currentStep',
  ContactForm = 'contactForm',
  SelectedLoan = 'selectedLoan',
  LastOtpSent = 'lastOtpSent',
  LastOtpSentPhoneNumber = 'lastOtpSentPhoneNumber',
  LastLoginTime = 'lastLoginTime',
  Token = 'token',
  SimpleCarVariantDetails = 'simpleCarVariantDetails',
  CustomerId = 'customerId',
  UtmTags = 'utmTags',
  ChunkLoadFailed = 'chunk_failed',
  CityOtr = 'cityOtr',
  SelectedLoanPermutation = 'SelectedLoanPermutation',
  CarFilter = 'filter',
  FinancialData = 'financialData',
  PageBeforeLogin = 'pageBeforeLogin',
  PageBeforeLoginExternal = 'pageBeforeLoginExternal',
  OtpIsSent = 'OtpIsSent',
  OtpTimerIsStart = 'OtpTimerIsStart',
  CustomerName = 'customerName',
  Model = 'model',
  DpPercentage = 'dpPercentage',
  Income = 'income',
  PromoCodeGiiass = 'promoCodeGiias',
  FromGiiasCalculator = 'fromGiiasCalculator',
  referralCode = 'referralCode', // code of current user itself
  SelectedLoanTmp = 'selectedLoanTmp',
  referralTemanSeva = 'referralTemanSeva', // code of other user that current user use
  FullNameRefi = 'fullNameRefi',
  PhoneNumberRefi = 'phoneNumberRefi',
  IdCustomerRefi = 'idCustomerRefi',
  refinancingOpenForm = 'refinancingOpenForm',
  baseConf = 'base-conf',
  citySelector = 'city-selector',
  menu = 'menu',
  sevaCust = 'seva-cust',
  ReferralCodePrelimQuestion = 'referralCodePrelimQuestion', // code when submit PA
  CurrentCarOfTheMonthItem = 'currentCarOfTheMonthItem',
  MoengageAttribute = 'moengageAttribute',
  PAAmbassadorInfo = 'paAmbassadorInfo',
  SelectedAngsuranType = 'selectedAngsuranType',
  SelectedRateType = 'SelectedRateType',
  LeadId = 'leadId',
  SelectedLoanPtbc = 'SelectedLoanPtbc',
  PtbcFormData = 'ptbcFormData',
  CarCollection = 'carCollection',
  CityOtrList = 'cityOtrList',
  flagLeads = 'flag-leads',
  onOtpVerification = 'onOtpVerification',
  flagResultFilterInfoPLP = 'flagResultFilterInfoPLP',
  LastTimeSelectCity = 'lastTimeSelectCity',
  resultPreApproval = 'resultPreApproval',
  PageBeforeProfile = 'pageBeforeProfile',
}

export enum SessionStorageKey {
  lastOtpSent = 'lastOtpSent',
  PreviouslyViewed = 'previouslyViewed',
  CustomerId = 'customerId',
  RegisteredName = 'registeredName',
  RegisteredPhoneNumber = 'registeredPhoneNumber',
  ShowWebAnnouncementNonLogin = 'showWebAnnouncementNonLogin',
  ShowWebAnnouncementLogin = 'showWebAnnouncementLogin',
  PreapprovalData = 'preapprovalData',
  CrmCustomerData = 'crmCustomerData',
  CrmReferralCodeData = 'crmReferralCodeData',
  CrmCheckincode = 'crmCheckinCode',
  CrmRegisterForm = 'crmRegisterForm',
  CrmCheckinReplacementForm = 'crmRegisterForm',
  CrmPhoneNumber = 'crmPhoneNumber',
  SalesRegisterForm = 'salesRegisterForm',
  CrmCheckinBuChoice = 'crmCheckinBuChoice',
  CrmNonSelfCheckin = 'crmNonSelfCheckin',
  CrmSelfCheckin = 'crmSelfCheckin',
  AttendedAs = 'attendedAs',
  PromoCodeGiiass = 'promoCodeGiiass',
  SPKFormGiias = 'spkFormGiias',
  SpkVerifyBU = 'spkVerifyBU',
  SpkSubmitResponse = 'spkSubmitResponse',
  SalesInfo = 'salesInfo',
  ExternalPreApprovalData = 'externalPreApprovalData',
  PAAmbassadorUrlId = 'PAAmbassadorUrlId',
  LoanRankFromPLP = 'LoanRankFromPLP',
}

export enum HTTPResponseStatusCode {
  TooManyRequest = 429,
  Unauthorized = 401,
  Forbidden = 403,
  BadRequest = 400,
  InternalServerError = 500,
}

export enum ErrorCode {
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
}

export enum UTMTags {
  UtmSource = 'utm_source',
  UtmMedium = 'utm_medium',
  UtmCampaign = 'utm_campaign',
  UtmContent = 'utm_content',
  UtmTerm = 'utm_term',
  UtmId = 'utm_id',
  Adset = 'adset',
}

export enum UnverifiedLeadSubCategory {
  SEVA_NEW_CAR_LP_LEADS_FORM = 'SEVNCLFH',
  SEVA_NEW_CAR_HUBUNGI_KAMI = 'SEVNCCUS',
  SEVA_NEW_CAR_CAR_OF_THE_MONTH = 'SEVNCCOM',
  SEVA_NEW_CAR_PROMO_LEADS_FORM = 'SEVNCPLF',
  SEVA_NEW_CAR_PDP_LEADS_FORM = 'SEVNCVLF',
  SEVA_NEW_CAR_PLP_LEADS_FORM = 'SEVNCSPF',
  SEVA_NEW_CAR_SEARCH_WIDGET = 'SEVNCSWG',
  SEVA_NEW_CAR_OFFLINE_EVENT_FORM_COLD = 'SEVNCOEC',
  SEVA_NEW_CAR_OFFLINE_EVENT_FORM_HOT = 'SEVNCOEH',
}

export enum ContactType {
  phone = 'phone',
  whatsApp = 'whatsApp',
}
