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

export enum Property {
  Yes = 'yes',
  No = 'no',
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

export enum Education {
  PrimarySchool = 'SD',
  SecondarySchool = 'SMP',
  HighSchool = 'SMA',
  BachelorsDegree = 'S1',
  MastersDegree = 'S2',
  DoctoratesDegree = 'S3',
  VocationalCertificate = 'D3',
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

export enum CustomerPreApprovalStatus {
  Failed = 'failed',
  Success = 'success',
  InProgress = 'in_progress',
  PendingResult = 'pending_result',
  NotStarted = 'not_started',
}

export enum InstallmentTypeOptions {
  ADDB = 'ADDB',
  ADDM = 'ADDM',
}

export enum AttendeePurpose {
  BUYCAR = 'BUYCAR',
  SEEEXIBITION = 'SEEEXIBITION',
}

export enum CameraType {
  BackEN = 'back',
  BackBAHASA = 'belakang',
}

export enum CameraFacingMode {
  front = 'user',
  back = 'environment',
}

export enum ContactType {
  phone = 'phone',
  whatsApp = 'whatsApp',
}

export enum SizeType {
  Large = 'large',
  Small = 'small',
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

export enum UploadChannel {
  Camera = 'camera',
  Gallery = 'gallery',
}

export enum PreApprovalResultScore {
  PASS = 'PASS',
  NOT_PASS = 'NOT_PASS',
}

export enum ElementTagName {
  Input = 'INPUT',
  Textarea = 'TEXTAREA',
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
