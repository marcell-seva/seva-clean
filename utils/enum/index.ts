export type PickEnum<T, K extends T> = {
  [P in keyof K]: P extends K ? P : never
}

export enum LanguageCode {
  en = 'en',
  id = 'id',
}

export enum Environment {
  Localhost = 'localhost',
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
}

export enum InputVersion {
  Default = 'Default',
  Mobile = 'Mobile',
}

export enum InputVersionType {
  Primary = 'Primary',
  Secondary = 'Secondary',
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
  CreditQualificationResult = 'creditQualificationResult',
  CreditQualificationLeadPayload = 'creditQualificationLeadPayload',
  SelectablePromo = 'selectablePromo',
  QualifcationCredit = 'qualification_credit',
  ChangeKtp = 'change_ktp',
  FormKtp = 'formKtp',
  PreApprovalResult = 'preApprovalResult',
  LastHitTracker = 'lastHitTracker',
  carModelLoanRank = 'carModelLoanRank', // loan rank on plp
  LastTimeUpdateUtm = 'lastTimeUpdateUtm',
}

export enum SessionStorageKey {
  lastOtpSent = 'lastOtpSent',
  OCRKTP = 'OCRKTP',
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
  KalkulatorKreditForm = 'KalkulatorKreditForm',
  DataUploadKTP = 'DataUploadKTP',
  DataUploadKTPSpouse = 'DataUploadKTPSpouse',
  MainKtpDomicileOptionData = 'mainKtpDomicileOptionData',
  ReviewedKtpData = 'reviewedKtpData',
  MainKtpType = 'mainKtpType',
  KTPUploaded = 'KTPUploaded',
  HasOpenedInsuranceToast = 'hasOpenedInsuranceToast',
  PreviousPage = 'PreviousPage',
  UserType = 'UserType',
  HasOpenSevaBefore = 'hasOpenSevaBefore',
  PageReferrerPDP = 'pageReferrerPdp',
  PreviousSourceButtonPDP = 'previousSourceButtonPDP',
  PageReferrerLC = 'pageReferrerLC',
  PreviousSourceSectionLC = 'previousSourceSectionLC',
  HasTrackedDpSliderLC = 'hasTrackedDpSliderLC',
  PageReferrerHomepage = 'pageReferrerHomepage',
  PreviousSourceButtonHomepage = 'previousSourceButtonHomepage',
  HasTracked360Exterior = 'hasTracked360Exterior',
  PreviousCarDataBeforeLogin = 'previousCarDataBeforeLogin',
  PreviousSourceSectionLogin = 'previousSourceSectionLogin',
  PageReferrerLoginPage = 'pageReferrerLoginPage',
  IsShowBadgeCreditOpportunity = 'IsShowBadgeCreditOpportunity',
  PageReferrerProfilePage = 'pageReferrerProfilePage',
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

export enum AgeGroup {
  'From18to27' = '18-27',
  'From28to34' = '28-34',
  'From35to50' = '35-50',
  'OlderThan50' = '>51',
}

export enum DocumentType {
  KTP = 'KTP',
}

export enum DocumentFileNameKey {
  Self = 'self',
}

export enum FrameType {
  Capture = 'Capture',
  Preview = 'Preview',
  Crop = 'Crop',
}

export const frameRatios = {
  [DocumentType.KTP]: {
    [FrameType.Capture]: 203 / 328,
    [FrameType.Crop]: 203 / 328,
    [FrameType.Preview]: 203 / 328,
  },
}

export const frameMargins = {
  [DocumentType.KTP]: {
    [FrameType.Capture]: [0, 16],
    [FrameType.Crop]: [0, 16],
    [FrameType.Preview]: [0, 16],
  },
}

export enum UploadDataKey {
  File = 'file',
  FileKey = 'fileKey',
  FileType = 'fileType',
}
