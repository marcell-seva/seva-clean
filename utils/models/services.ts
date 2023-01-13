export enum SessionStorageKey {
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
  SelectedAngsuranType = 'selectedAngsuranType',
  SelectedRateType = 'SelectedRateType',
  ExternalPreApprovalData = 'externalPreApprovalData',
}

export enum SortSpkOptions {
  NamaCustomerAZ = 'Nama Customer A-Z',
  NamaCustomerZA = 'Nama Customer Z-A',
  Terbaru = 'Terbaru',
  Terlama = 'Terlama',
}

export enum AmplitudeRejectReason {
  DP_Capacity_Not_In_Range = '001',
  Occupation_Blacklisted = '002',
  EKYC_Failed = '004',
  COVADEX_Blacklisted = '005',
  Bank_Link_Result_Fail = '006',
  Unsupported_Province = '007',
}

export enum WebSocketNamespace {
  preApprovalNotifyEkycCompletion = 'pre notify ekyc completion',
  connect = 'connect',
  token = 'token',
}

export enum WebSocketTokenResult {
  success = 'success',
  failed = 'failed',
}

export enum Environment {
  Localhost = 'localhost',
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
}

export enum WebviewMessageType {
  BackToNativeFromPreApprovalSuccessPage = 'backToNativeFromPreApprovalSuccessPage',
  Token = 'token',
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

export enum LocalStorageKey {
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
  PageBeforeLogin = 'pageBeforeLogin',
  OtpIsSent = 'OtpIsSent',
  OtpTimerIsStart = 'OtpTimerIsStart',
  CustomerName = 'customerName',
  Model = 'model',
  DpPercentage = 'dpPercentage',
  Income = 'income',
  PromoCodeGiiass = 'promoCodeGiias',
  FromGiiasCalculator = 'fromGiiasCalculator',
  referralCode = 'referralCode',
  SelectedLoanTmp = 'selectedLoanTmp',
  referralTemanSeva = 'referralTemanSeva',
  FullNameRefi = 'fullNameRefi',
  PhoneNumberRefi = 'phoneNumberRefi',
  IdCustomerRefi = 'idCustomerRefi',
  refinancingOpenForm = 'refinancingOpenForm',
}

export enum QueryKeys {
  LoanRank = 'loanRank',
  DpAmount = 'dpAmount',
  Tenure = 'tenure',
  MonthlyInstallment = 'monthlyInstallment',
  ModelId = 'modelId',
  VariantId = 'variantId',
  AdVariation = 'adVariation',
  UtmSource = 'utm_source',
  UtmMedium = 'utm_medium',
  UtmCampaign = 'utm_campaign',
  UtmContent = 'utm_content',
  UtmTerm = 'utm_term',
  UtmId = 'utm_id',
  AdSet = 'adset',
  CarBodyType = 'bodyType',
  CarBrand = 'brand',
  page = 'page',
  Id = 'id',
  QrType = 'qrtype',
}

export enum AdVariation {
  FindACar = 'find_a_car',
  FindALoan = 'find_a_loan',
  FindAPromo = 'find_a_promo',
  Concierge = 'concierge',
}

export enum EditState {
  Open,
  Close,
}

export enum PreApprovalProgressType {
  Questions = 'questions',
  Files = 'files',
  Bank = 'bank',
}

export enum LocationStateKey {
  isCarRecommendationsEmpty = 'isCarRecommendationsEmpty',
  Reevaluated = 'reevaluated',
  IsCarRecommendationsEmpty = 'isCarRecommendationsEmpty',
  OtpSent = 'otpSent',
  IsFromLoginPage = 'isFromLoginPage',
  File = 'file',
  Channel = 'channel',
  IsFromPopularCar = 'isFromPopularCar',
  Base64 = 'base64',
  Blob = 'blob',
}

export enum EkycStatus {
  EkycSuccessful = 'EkycSuccessful',
  EkycInProgress = 'EkycInProgress',
  GeneralError = 'GeneralError',
  EkycProcessCanceled = 'EkycProcessCanceled',
  TransactionTimedOut = 'TransactionTimedOut',
  UserInfoNotValidAndNotMatched = 'UserInfoNotValidAndNotMatched',
  GenericError = 'GenericError',
}

export enum EkycProgress {
  DemographicValidationInProgress = 'DemographicValidationInProgress',
  BiometricValidationInProgress = 'BiometricValidationInProgress',
  CertificateGenerate = 'CertificateGenerate',
  CVVSentToUser = 'CVVSentToUser',
  ServerCVVDeliveryAcknowledged = 'ServerCVVDeliveryAcknowledged',
}

export enum EkycStatusV2 {
  FR_FAILED = 'FR_FAILED',
  DEMOG_FAILED = 'DEMOG_FAILED',
  SUBMITTED = 'SUBMITTED',
  PROVISIONED = 'PROVISIONED',
  INPROGRESS = 'INPROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum EkycStatusCodeV2 {
  FR_FAILED = -7,
  DEMOG_FAILED = -5,
  SUBMITTED = -4,
  PROVISIONED = -3,
  INPROGRESS = -1,
  COMPLETED = 0,
  FAILED = 1 || 2 || 3,
}
