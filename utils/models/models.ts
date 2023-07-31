export enum LanguageCode {
  en = 'en',
  id = 'id',
}

export enum CityOtrCode {
  jabodetabek = 'jabodetabek',
  surabaya = 'surabaya',
}

export enum AgeGroup {
  'From18to27' = '18-27',
  'From28to34' = '28-34',
  'From35to50' = '35-50',
  'OlderThan50' = '>51',
}

export enum CompanyOption {
  seva = 'SEVA',
  dso = 'DSO',
  tso = 'TSO',
  bso = 'BSO',
  iso = 'ISO',
  pso = 'PSO',
  acc = 'ACC',
  taf = 'TAF',
  fif = 'FIFGROUP',
  asuransiAstra = 'AAB',
  astraLife = 'ASTRALIFE',
  permataBank = 'PERMATABANK',
  moxa = 'MOXA',
  astraPay = 'ASTRAPAY',
  mauCash = 'MAUCASH',
  astridoToyota = 'ASTRIDOTOYOTA',
  plazaTOYOTA = 'PLAZATOYOTA',
  tunasTOYOTA = 'TUNASTOYOTA',
  SETIAJAYATOYOTA = 'SETIAJAYATOYOTA',
  dayaTOYOTA = 'DAYATOYOTA',
  dawDAIHATSU = 'DAWDAIHATSU',
  karyaZirangUtamaDAIHATSU = 'KARYAZIRANGUTAMADAIHATSU',
  PRADHANARAYAMOBILINDODAIHATSU = 'PRADHANARAYAMOBILINDODAIHATSU',
  TRIMANDIRISELARASDAIHATSU = 'TRIMANDIRISELARASDAIHATSU',
  ARMADAAUTOTARADAIHATSU = 'ARMADAAUTOTARADAIHATSU',
  ASCODAIHATSU = 'ASCODAIHATSU',
  ASTRIDODAIHATSU = 'ASTRIDODAIHATSU',
  PRIMAPARAMAMOBILINDODAIHATSU = 'PRIMAPARAMAMOBILINDODAIHATSU',
  TUNASDAIHATSU = 'TUNASDAIHATSU',
  ANZONAUTOLESTARITOYOTA = 'ANZONAUTOLESTARITOYOTA',
  KHARISMADHAIHATSU = 'KHARISMADAIHATSU',
  ARMADADAIHATSU = 'ARMADADAIHATSU',
  KARUNIADAIHATSU = 'KARUNIADAIHATSU',
  LIEKMOTOR = 'LIEKMOTOR',
  ASRIMOTOR = 'ASRIMOTOR',
  ARINA = 'ARINA',
  others = 'OTHER',
}

export enum PlannedTime {
  morning = 'Pagi (10.00-12.00 WIB)',
  afternoon = 'Siang (12.00-16.00 WIB)',
  evening = 'Sore (16.00-19.00 WIB)',
}

export enum PlannedTimeValue {
  morning = 'PAGI',
  afternoon = 'SIANG',
  evening = 'SORE',
}

export enum Marital {
  Married = 'Menikah',
  Single = 'Belum Menikah',
}

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Others = 'Others',
}

export enum Alamat {
  Kos = 'Kos',
  Rumah = 'Rumah',
  Apartemen = 'Apartemen',
}

export enum IncomeGroup {
  '<2M' = '<2M',
  '2M-4M' = '2M-4M',
  '4M-6M' = '4M-6M',
  '6M-8M' = '6M-8M',
  '8M-10M' = '8M-10M',
  '10M-20M' = '10M-20M',
  '20M-50M' = '20M-50M',
  '50M-75M' = '50M-75M',
  '75M-100M' = '75M-100M',
  '100M-150M' = '100M-150M',
  '150M-200M' = '150M-200M',
  '>200M' = '>200M',
  'Others' = 'OTHERS',
}

export enum IncomeGroupV2 {
  '<2 juta' = '<2 juta',
  '4 - 6 juta' = '4 - 6 juta',
  '6 - 8 juta' = '6 - 8 juta',
  '8 - 10 juta' = '8 - 10 juta',
  '10 - 20 juta' = '10 - 20 juta',
  '20 - 50 juta' = '20 - 50 juta',
  '50 - 75 juta' = '50 - 75 juta',
  '75 - 100 juta' = '75 - 100 juta',
  '100 - 150 juta' = '100 - 150 juta',
  '150 - 200 juta' = '150 - 200 juta',
  '>200 juta' = '>200 juta',
}

export enum CashFlow {
  Salary = 'Salary',
  Earnings = 'Earnings',
  Spouse = 'Spouse',
  Parents = 'Parents',
  SubMonthlySalary = 'MonthlySalary',
  SubOwnEarnings = 'OwnEarnings',
}

export enum CashFlowIncomeType {
  Fixed = 'Fixed',
  Variable = 'Variable',
}

export enum Occupation {
  DesignerAndArtsProfessional = 'Designer & arts professional',
  DoctorAndMedicalWorker = 'Doctor & medical worker',
  LawProfessional = 'Law professional',
  StayAtHomeMother = 'Stay at home mother',
  PrivateCompanyEmployee = 'Employee (private company)',
  Other = 'Other',
  GovernmentEmployeePNS = 'Government employee (PNS)',
  InformalWorker = 'Informal worker',
  Student = 'Student',
  TeacherAndProfessorAndResearcher = 'Teacher, professor & researcher',
  Retiree = 'Retiree',
  FarmerAndFishermenAndBreeder = 'Farmer, fishermen & breeder',
  PolicemanAndArmyAndSecurity = 'Policeman, army & security',
  SelfEmployedAndDistributors = 'Self employed & distributors',
}

export enum OccupationNewer {
  KaryawanSwasta = 'Karyawan Swasta',
  WiraswastaDistributor = 'Wiraswasta Distributor',
  PetaniNelayanPeternak = 'Petani, Nelayan, & Peternak',
  Lainnya = 'Lainnya',
  IbuRumahTangga = 'Ibu Rumah Tangga',
  PegawaiNegeriSipil = 'Pegawai Negeri Sipil',
  PengajarPeneliti = 'Pengajar & Peneliti',
  PolisiAbriKeamanan = 'Polisi, Abri, & Keamanan',
  PelajarMahasiswa = 'Pelajar/Mahasiswa',
  DokterTenagaMedis = 'Dokter & Tenaga Medis',
  Pensiunan = 'Pensiunan',
  PekerjaInformal = 'Pekerja Informal',
  DesainerPekerjaSeni = 'Desainer & Pekerja Seni',
  Hukum = 'Hukum',
}

export enum Education {
  PrimarySchool = 'SD',
  SecondarySchool = 'SMP',
  HighSchool = 'SMA',
  BachelorsDegree = 'S1',
  MastersDegree = 'S2',
  DoctoratesDegree = 'S3',
  VocationalCertificate = 'D3',
}

export enum Seats {
  LessThanOrEqualTo5Seater = '0',
  MoreThan5Seater = '1',
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

export enum LoanRank {
  Green = 'Green',
  Yellow = 'Yellow',
  Red = 'Red',
}

export enum NewLoanRank {
  Green = 'Green',
  Red = 'Red',
}

export enum LoanRankSeva {
  Red = 'Red',
  Blue = 'Blue',
  Grey = 'Grey',
}
export enum CarTileSize {
  Big = 'Big',
  Small = 'Small',
}

export enum VariantFuelType {
  Diesel = 'Diesel',
  Petrol = 'Bensin',
  Hybrid = 'Hybrid',
  Electric = 'Electric',
}

export enum VariantTransmissionType {
  Manual = 'Manual',
  Automatic = 'Otomatis',
}

export enum VariantBodyType {
  MPV = 'MPV',
  SUV = 'SUV',
  Commercial = 'COMMERCIAL',
  Hatchback = 'HATCHBACK',
  Sedan = 'SEDAN',
  Sport = 'SPORT',
}

export enum Property {
  Yes = 'yes',
  No = 'no',
}

export enum SurveyFormKey {
  Name = 'name',
  Age = 'age',
  GenderTmp = 'genderTmp',
  Gender = 'gender',
  Occupation = 'occupation',
  Education = 'education',
  City = 'city',
  CashFlow = 'cashFlow',
  TotalIncome = 'totalIncome',
  DownPayment = 'downPayment',
  HomeOwnership = 'homeOwnership',
  SeatNumber = 'seatNumber',
  TotalIncomeTmp = 'totalIncomeTmp',
  AgeTmp = 'ageTmp',
  DownPaymentTmp = 'downPaymentTmp',
  SpecialRateEnable = 'specialRateEnable',
  OldCalculatorResult = 'oldCalculatorResult',
}

export enum VariantSpecificationsType {
  BodyType = 'bodyType',
  FuelType = 'fuelType',
  Transmission = 'Transmission',
  EngineCapacity = 'EngineCapacity',
  CarSeats = 'CarSeats',
  Length = 'length',
}

export enum ContactFormKey {
  Name = 'name',
  PurchaseTime = 'purchaseTime',
  ContactTime = 'contactTime',
  PhoneNumber = 'phoneNumber',
  PhoneNumberValid = 'phoneNumberValid',
  PhoneNumberMiniSurvey = 'phoneNumberMiniSurvey',
  IsRegistered = 'isRegistered',
  CalculateLoan = 'calculateLoan',
  SpecialRateResult = 'specialRateResult',
  Dob = 'dob',
  CheckBox1 = 'checkBox1',
  CheckBox2 = 'checkBox2',
  SubmittedForm = 'submittedForm',
  IsLogin = 'isLogin',
  Email = 'email',
  NameTmp = 'nameTmp',
  Gender = 'gender',
  Marital = 'marital',
  ReferralCode = 'referralCode',
}

export enum PurchaseTime {
  Within2Weeks = 'Within 2 weeks',
  Within1Month = 'Within 1 month',
  Within2Months = 'Within 2 months',
  InOver2Months = 'In over 2 months',
}

export enum ContactTime {
  Morning = 'Morning',
  Afternoon = 'Afternoon',
  Evening = 'Evening',
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
  priceRangeGroup = 'priceRangeGroup',
  monthlyIncome = 'monthlyIncome',
  age = 'age',
  downPaymentAmount = 'downPaymentAmount',
  sortBy = 'sortBy',
}

export enum HTTPResponseStatusCode {
  TooManyRequest = 429,
  Unauthorized = 401,
  Forbidden = 403,
  BadRequest = 400,
  InternalServerError = 500,
}

export enum FileFormat {
  Webp = '.webp',
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

export enum FunnelQueryKey {
  PaymentType = 'paymentType',
  DownPaymentType = 'downPaymentType',
  MonthlyInstallment = 'monthlyInstallment',
  DownPaymentAmount = 'downPaymentAmount',
  DownPaymentPercentage = 'downPaymentPercentage',
  PhoneNumber = 'phoneNumber',
  CarModel = 'carModel',
  Brand = 'brand',
  Age = 'age',
  BodyType = 'bodyType',
  Category = 'category',
  MinPrice = 'minPrice',
  MaxPrice = 'maxPrice',
  SortBy = 'sortBy',
}

export enum FunnelItemStepAction {
  SurveyContent = 'surveyContent',
  PickCar = 'pickCar',
  TalkToAgents = 'talkToAgents',
  TrackProgress = 'trackProgress',
}

export enum AdVariation {
  FindACar = 'find_a_car',
  FindALoan = 'find_a_loan',
  FindAPromo = 'find_a_promo',
  Concierge = 'concierge',
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
  loanRankCVL = 'loanRankCVL',
  PAAmbassadorError = 'paAmbassadorError',
  IsAutoCalculatePtbc = 'isAutoCalculatePtbc',
  IsAutoScrollFormPtbc = 'isAutoScrollFormPtbc',
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

export enum PreApprovalProgressType {
  Questions = 'questions',
  Files = 'files',
  Bank = 'bank',
}

export enum PreApprovalQuestionsKey {
  PhoneNumber = 'phoneNumber', // only exist on external IA
  OtpInput = 'otpInput', // only exist on external IA
  Occupation = 'occupation',
  TotalIncome = 'totalIncome',
  Address = 'address',
  Email = 'email',
}

export enum PreApprovalQuestionsAddressKey {
  Province = 'province',
  City = 'city',
  ZipCode = 'zipCode',
}

export enum CameraConfig {
  CameraEnvironment = 'environment',
  UserCamera = 'user',
}
export enum PageFrom {
  CarResult = 'car_results',
  CarResultDetails = 'car_result_details',
  CarResultVariant = 'car_result_variant',
}

export enum UploadChannel {
  Camera = 'camera',
  Gallery = 'gallery',
}

export enum SupportedBrand {
  toyota = 'Toyota',
  daihatsu = 'Daihatsu',
  bmw = 'BMW',
}

export enum PreApprovalResultScore {
  PASS = 'PASS',
  NOT_PASS = 'NOT_PASS',
}

export enum ImageType {
  JPEG = 'image/jpeg',
  JPG = 'image/jpg',
  PNG = 'image/png',
  WEBP = 'image/webp',
}
export enum RedirectedPage {
  Home = 'home',
  Search = 'search',
  SearchPhone = 'search-phone',
}

export enum ErrorCode {
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
}

export enum CustomerPreApprovalStatus {
  Failed = 'failed',
  Success = 'success',
  InProgress = 'in_progress',
  PendingResult = 'pending_result',
  NotStarted = 'not_started',
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

export enum ElementTagName {
  Input = 'INPUT',
  Textarea = 'TEXTAREA',
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

export enum NewFunnelLoanRank {
  Red = 'Red',
  Yellow = 'Yellow',
  Green = 'Green',
  Grey = 'Grey',
}

export enum NewFunnelLoanRankSeva {
  Red = 'Green',
  Yellow = 'Yellow',
  Green = 'Red',
  Grey = 'Grey',
}
export enum NewFunnelLoanPermutationsKey {
  DpAmount = 'dpAmount',
  LoanRank = 'loanRank',
  MonthlyInstallment = 'monthlyInstallment',
  Tenure = 'tenure',
  DpPercentage = 'dpPercentage',
}

export enum NewFunnelLoanPermutationsKeySeva {
  DpAmount = 'dpAmount',
  LoanRankSeva = 'loanRankSeva',
  MonthlyInstallment = 'monthlyInstallment',
  Tenure = 'tenure',
  DpPercentage = 'dpPercentage',
}
export enum CameraType {
  BackEN = 'back',
  BackBAHASA = 'belakang',
}

export enum CameraFacingMode {
  front = 'user',
  back = 'environment',
}

export enum EditState {
  Open,
  Close,
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

export enum ContactType {
  phone = 'phone',
  whatsApp = 'whatsApp',
}

export enum SizeType {
  Large = 'large',
  Small = 'small',
}

export enum AmplitudeRejectReason {
  DP_Capacity_Not_In_Range = '001',
  Occupation_Blacklisted = '002',
  EKYC_Failed = '004',
  COVADEX_Blacklisted = '005',
  Bank_Link_Result_Fail = '006',
  Unsupported_Province = '007',
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
  KalkulatorKreditForm = 'KalkulatorKreditForm',
}

export enum CrmBussinessUnits {
  ACC = 'ACC',
  TAF = 'TAF',
  FIF = 'FIFGROUP',
  AAB = 'Asuransi Astra',
  PERMATA_BANK = 'PermataBank',
  SEVA = 'SEVA',
  ASTRA_LIFE = 'Astra Life',
  ASTRA_PAY = 'AstraPay',
  MOXA = 'Moxa',
  MAU_CASH = 'Maucash',
  BSO = 'Astra BMW',
  DSO = 'Astra Daihatsu',
}

export enum SortSpkOptions {
  NamaCustomerAZ = 'Nama Customer A-Z',
  NamaCustomerZA = 'Nama Customer Z-A',
  Terbaru = 'Terbaru',
  Terlama = 'Terlama',
}

export enum InstallmentTypeOptions {
  ADDB = 'ADDB',
  ADDM = 'ADDM',
}

export enum DealerIdentifier {
  TSO = 'TS',
  DSO = 'DS',
  BSO = 'BS',
  ISO = 'IS',
  PSO = 'PS',
  ACC = 'AC',
  TAF = 'TA',
  PERMATABANK = 'PB',
  FIFGROUP = 'FI',
  AAB = 'AA',
  ASTRALIFE = 'AL',
  SEVA = 'SE',
  MOXA = 'MO',
  ASTRAPAY = 'AP',
  MAUCASH = 'MA',
}

export enum AttendeePurpose {
  BUYCAR = 'BUYCAR',
  SEEEXIBITION = 'SEEEXIBITION',
}

export enum AttendeeBrandCar {
  TOYOTA = 'Toyota',
  DAIHATSU = 'Daihatsu',
  PEUGEOT = 'Peugeot',
  ISUZU = 'Isuzu',
  BMW = 'BMW',
  LEXUS = 'Lexus',
  OTHERS = 'Lainnya',
}

export enum PreApprovalFlowType {
  Ptbc = 'ptbc',
  New = 'new',
  PAAmbassador = 'pa-ambassador',
}

export enum TrackerFlag {
  Init = 'init',
  Sent = 'sent',
}

export const initUSPAttributes = {
  head_title: '',
  icon_1: {
    data: {
      attributes: {
        url: '',
        formats: {
          thumbnail: {
            name: '',
          },
        },
      },
    },
  },
  icon_2: {
    data: {
      attributes: {
        url: '',
        formats: {
          thumbnail: {
            name: '',
          },
        },
      },
    },
  },
  icon_3: {
    data: {
      attributes: {
        url: '',
        formats: {
          thumbnail: {
            name: '',
          },
        },
      },
    },
  },
  subtitle_1: '',
  subtitle_2: '',
  subtitle_3: '',
  title_1: '',
  title_2: '',
  title_3: '',
}
