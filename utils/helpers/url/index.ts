const internalUrls = {
  rootUrl: '/',
  homeUrl: '/home',
  homePhoneUrl: '/home/phone',
  phoneUrl: '/phone',
  variantDetailsUrl: '/variant-details/:id',
  newFunnelVariantDetailsUrl: '/new-variant-details/:id',
  newFunnelVariantDetailsUrlTorq: '/new-variant-details-torq/:id',
  otpInputPage: '/otp',
  appDownloadUrl: '/appDownload',
  questionsUrl: '/questions',
  carResultsUrl: '/mobil-baru',
  carResultsUrlId: '/mobil-baru/:id',
  variantListOldDesignUrl: '/var/mobil-baru/:brand/:model',
  variantListUrlId: '/mobil-baru/:brand/:model/:id/:tab?',
  variantListPriceUrl: '/mobil-baru/:brand/:model/:tab',
  variantListUrl: '/mobil-baru/:brand/:model/:tab?',
  loginUrl: '/login',
  preApprovalStartUrl: '/pre-approval-start',
  preApprovalStartUrlWithType: '/pre-approval-start/:paFlowType',
  preApprovalQuestionFlowUrl: '/pre-approval-question-flow',
  preApprovalQuestionFlowUrlWithType: '/pre-approval-question-flow/:paFlowType',
  basicCheckFailureUrl: '/pre-approval-basic-check',
  preApprovalFailureUrl: '/pre-approval-check',
  startEkycUrl: '/ekyc',
  startEkycUrlWithType: '/ekyc/:paFlowType',
  preApprovalVerifyKTPUrl: '/pre-approval-verify-ktp',
  preApprovalVerifyKTPUrlWithType: '/pre-approval-verify-ktp/:paFlowType',
  cameraUrl: '/camera',
  cameraUrlWithType: '/camera/:paFlowType',
  qrScannerUrl: '/qr-scanner',
  imagePreviewUrl: '/image-preview',
  imageQualityCheckUrl: '/image-quality-check',
  imageQualityCheckUrlWithType: '/image-quality-check/:paFlowType',
  ocrSuccessUrl: '/ocr-success',
  ocrSuccessUrlWithType: '/ocr-success/:paFlowType',
  ocrFailureUrl: '/ocr-fail',
  ocrFailureUrlWithType: '/ocr-fail/:paFlowType',
  bankSelectionUrl: '/bank-selection',
  bankSelectionUrlWithType: '/bank-selection/:paFlowType',
  brickLinkOK: '/link-brick-success',
  brickLinkOKWithType: '/link-brick-success/:paFlowType',
  brickLinkERR: '/link-brick-fail',
  preApprovalSMSUrl: '/pre-approval-sms-sending',
  editIncomePageUrl: '/edit-income',
  imageCropPageUrl: '/image-crop',
  imageCropPageUrlWithType: '/image-crop/:paFlowType',
  preApprovalConfirmationUrl: '/pac/:customerId',
  preApprovalConfirmationUrlNew: '/pac/new/:leadId',
  newFunnelLoanCalculatorUrl:
    '/mobil-baru/:brand/:model/:variant/kalkulator-kredit',
  newFunnelLoanCalculatorUrlSpecialRate:
    '/mobil-baru/:brand/:model/:variant/kalkulator-kredit-promo',
  contactUsUrl: '/contact-us',
  termsAndConditions: '/terms-conditions',
  privacyPolicy: '/privacy-policy',
  newFunnelLoanCalculatorSevaUrl: '/new-funnel-loan-calculator-seva/:id',
  LoginSevaUrl: '/masuk-akun',
  RegisterSevaUrl: '/daftar-akun',
  LoginThankYouUrl: '/masuk-akun/berhasil',
  RegisterThankYouUrl: '/daftar-akun/berhasil',
  loginOtpInputPageSevaUrl: '/masuk-akun/otp',
  registerOtpInputPageSevaUrl: '/daftar-akun/otp',
  blogUrl: '/blog',
  AlreadyPreApprovedSevaUrl: '/pre-approval-check-fail',
  AccountSevaUrl: '/akun/:id',
  CRMRegistrationUrl: '/event/giiasjkt2022/claimticket-form',
  crmRegistrationReferralUrl: '/event/giiasjkt2022/claimticket',
  crmRegistrationSuccessUrl: '/event/giiasjkt2022/claimticket-success',
  crmRegistrationSuccessShowQrUrl: '/event/giiasjkt2022/claimticket-viewqr',
  CRMRegistrationOtpUrl: '/event/giiasjkt2022/claimticket-otp',
  RegisterSalesmanSevaUrl: '/event/giiasjkt2022/saregistration',
  UploadIdSalesmanUrl: '/camera-upload-id',
  imageSalesmanPageUrl: '/image-salesman',
  RegisterSalesmanSuccessUrl: '/event/giiasjkt2022/saregistration-success',
  RegisterSalesmanSuccessSmsUrl: '/event/giiasjkt2022/saregistration-viewqr',
  CrmCheckinUrl: '/event/giiasjkt2022/checkin',
  CrmCheckinRegisterUrl: '/event/giiasjkt2022/checkin-form',
  CrmCheckinRegisterSuccessUrl:
    '/event/giiasjkt2022/checkin-replacement-success',
  CrmCheckinSuccessUrl: '/event/giiasjkt2022/checkin-success',
  CRMCheckInOtpUrl: '/event/giiasjkt2022/checkin-replacement-otp',
  SalesDashboardUrl: '/event/giias/sales-dashboard',
  NewRegularCalculatorUrl:
    '/mobil-baru/:brand/:model/:variant/temp-regular-calculator',
  SalesSPKForm: '/event/giias/spk-form',
  SalesSPKSuccessUrl: '/event/giias/spk-success',
  SpkInputPhonePageUrl: '/event/giias/spk-phone',
  SpkOtpUrl: '/event/giias/spk-otp',
  newCalculatorwGiiasUrl:
    '/mobil-baru/:brand/:model/:variant/kalkulator-kredit-giias',
  registerSalesmanOtpInputPageSevaUrl: '/event/giiasjkt2022/saregistration-otp',
  vidaTimeoutUrl: '/vida-timeout-fail',
  HomepageOldDesignUrl: '/var/home',
  CarResultPageOldDesignUrl: '/var/mobil-baru',
  TemanSevaDashboardUrl: '/teman-seva/dashboard',
  TemanSevaRegisterUrl: '/teman-seva/register',
  TemanSevaRegisterSuccessUrl: '/teman-seva/register-success',
  TemanSevaOnboardingUrl: '/teman-seva/onboarding',
  TemanSevaDashboardReferralUrl: '/teman-seva/dashboard/referral-code',
  SalesDashboardPAUrl: '/sales-dashboard',
  PAAmbassadorFormUrl: '/paaform',
  PAAmbassadorFormStartUrl: '/paaformstart',
  PAAmbassadorFormNoSpkUrl: '/paaformnospk',
  TemanSevaDashboardScheme1Url: '/teman-seva/dashboard/skema-1',
  TemanSevaDashboardScheme2Url: '/teman-seva/dashboard/skema-2',
  TemanSevaDashboardScheme3Url: '/teman-seva/dashboard/skema-3',
  TemanSevaDashboardScheme4Url: '/teman-seva/dashboard/skema-4',
  TemanSevaAccountActivityUrl: '/teman-seva/dashboard/aktivitas-akun',
  PreApprovalStartExternalUrl: '/partner/pre-approval-start/:id',
  PreApprovalQuestionFlowExternalUrl: '/partner/pre-approval-question-flow',
  preApprovalVerifyKTPExternalUrl: '/partner/pre-approval-verify-ktp',
  cameraExternalUrl: '/partner/camera',
  imageCropPageExternalUrl: '/partner/image-crop',
  imageQualityCheckExternalUrl: '/partner/image-quality-check',
  ocrSuccessExternalUrl: '/partner/ocr-success',
  ocrFailureExternalUrl: '/partner/ocr-fail',
  startEkycExternalUrl: '/partner/ekyc',
  preApprovalSuccessExternalUrl: '/partner/pre-approval-success',
  basicCheckFailureExternalUrl: '/partner/pre-approval-basic-check',
  preApprovalFailureExternalUrl: '/partner/pre-approval-check',
  vidaTimeoutExternalUrl: '/partner/vida-timeout-fail',
  refinancingUrl: '/fasilitas-dana',
  refinancingFormUrl: '/fasilitas-dana/form',
  refinancingSuccessUrl: '/fasilitas-dana/form/success',
  untungSeruUrlRegister: '/landing-promo',
  untungSeruUrlVerifyOTP: '/landing-promo/otp',
  formUntungSeruURL: '/landing-promo/form',
  formSuccessUntungSeruURL: '/landing-promo/form/success',
  offlineLeadsFormUrl: '/booth/form',
  offlineLeadsSuccessUrl: '/booth/form/success',
  paAmbassadorLinkUrl: '/pa/ia/:orderId',
  ptbcFormUrl: '/partnership/PTBC',
  ptbcOtpUrl: '/partnership/PTBC/otp',
  ptbcOtpThankYouUrl: '/partnership/PTBC/berhasil',
  jumpaPayUrl: '/layanan-surat-kendaraan',
  formPromoURL: '/landing-promo-seva',
  successPromoURL: '/landing-promo-seva/success',
  landingZenixURL: '/form/zenix-hybrid',
  formZenixURL: '/form/zenix-hybrid/start',
  successZenixURL: '/form/zenix-hybrid/success',
  loanCalculatorDefaultUrl: '/kalkulator-kredit',
  loanCalculatorWithCityUrl: '/kalkulator-kredit/:cityName',
  loanCalculatorWithCityBrandUrl: '/kalkulator-kredit/:cityName/:brand',
  loanCalculatorWithCityBrandModelUrl:
    '/kalkulator-kredit/:cityName/:brand/:model',
  loanCalculatorWithCityBrandModelVariantUrl:
    '/kalkulator-kredit/:cityName/:brand/:model/:variant',
  creditQualificationUrl: '/kualifikasi-kredit',
  deleteAccountUrl: '/akun/profil/hapus-akun',
  deleteAccountReasonUrl: '/akun/profil/hapus-akun/alasan',
  deleteAccountSuccessUrl: '/akun/profil/hapus-akun/sukses',
  landingKtpUrl: '/akun/profil/landing-ktp',
  cameraKtpUrl: '/akun/profil/ktp/camera',
  verifyKtpUrl: '/akun/profil/ktp/verifikasi',
  formKtpUrl: '/akun/profil/ktp/form',
  successKtpUrl: '/akun/profil/ktp/success',
  successChangeKtpUrl: '/akun/profil/ktp/success-change-ktp',
  previewKtpUrl: '/akun/profil/ktp/preview',
}

const externalUrls = {
  about: 'https://www.seva.id/info/tentang-kami/',
  termsAndConditions: 'https://www.seva.id/info/syarat-dan-ketentuan/',
  privacyPolicy: 'https://www.seva.id/info/kebijakan-privasi/',
  contactUs: 'https://www.start.torq.id/hubungi-kami',
  googlePlayHref: 'https://torq.onelink.me/PgGB/222702ae',
  whatsappUrlPrefix: 'https://wa.me/',
  termsAndConditionsSeva: 'https://www.seva.id/info/syarat-dan-ketentuan/',
  privacyPolicySeva: 'https://www.seva.id/info/kebijakan-privasi/',
  contactUsSeva: 'https://www.start.torq.id/hubungi-kami',
  appStoreHerf: 'https://apps.apple.com/us/app/seva/id1589727482',
  instagram: 'https://www.instagram.com/sevabyastra',
  facebook: 'https://www.facebook.com/sevabyastra/',
  twitter: 'https://twitter.com/sevaid_official',
  mapGiiasJakarta2022: 'https://goo.gl/maps/cWic6aM4p8KwSYdc7',
  mapGiiasSurabaya2022: 'https://g.page/grandcityconvex?share',
  mapGiiasAstraBMW:
    'https://www.google.com/maps/place/BMW+Astra+Serpong/@-6.2875169,106.6387767,15z/data=!4m2!3m1!1s0x0:0x10a27e62671bc2e0?sa=X&ved=2ahUKEwjFvvj_n7v5AhX06jgGHUdPBkoQ_BJ6BAhCEAU',
  mapGiiasAstraDaihatsu:
    'https://www.google.com/maps/place/Astra+Daihatsu+BSD/@-6.2879544,106.6364952,17z/data=!3m1!4b1!4m5!3m4!1s0x2e69fb1adca60a13:0x9d45c65629e1c951!8m2!3d-6.2879597!4d106.6386839',
  promoPage: 'https://seva.id/promo/jelas-dari-awal',
  promoPageGiias: 'https://seva.id/promo/giias',
  articleWordpress: 'https://www.seva.id/blog',
  promoCumaDiSeva: 'https://seva.id/microsite/promo',
  strapiBaseUrl: 'https://api.sslpots.com',
  facebookTemanSeva: 'https://bit.ly/KomunitasTemanSEVA',
}

const urls = {
  internalUrls,
  externalUrls,
}
export default urls