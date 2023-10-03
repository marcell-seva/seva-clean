import { Environment } from 'utils/enum'

export type FeatureToggles = {
  [key in Environment]: FeatureTogglesPair
}
export type FeatureTogglesPair = {
  enableEkycCheck: boolean
  enableNewFunnelLoanCalculator: boolean
  enableRedirectPage: boolean
  enableLanguageDropdown: boolean
  enableAskToLoginOnLoanCalculator: boolean
  enableAccountDashboard: boolean
  enableOtpBypass: boolean
  enablePromoCodeField: boolean
  enableExternalIA: boolean
  enableVidaV2: boolean
  enableAnnouncementBoxAleph: boolean
  enableDeleteAccount: boolean
  enableUploadKtp: boolean
}
export const featureToggles: FeatureToggles = {
  [Environment.Localhost]: {
    enableEkycCheck: true,
    enableNewFunnelLoanCalculator: true,
    enableRedirectPage: true,
    enableLanguageDropdown: false,
    enableAskToLoginOnLoanCalculator: false,
    enableAccountDashboard: true,
    enableOtpBypass: true,
    enablePromoCodeField: true,
    enableExternalIA: true,
    enableVidaV2: true,
    enableAnnouncementBoxAleph: true,
    enableDeleteAccount: true,
    enableUploadKtp: false,
  },
  [Environment.Development]: {
    enableEkycCheck: true,
    enableNewFunnelLoanCalculator: true,
    enableRedirectPage: true,
    enableLanguageDropdown: false,
    enableAskToLoginOnLoanCalculator: false,
    enableAccountDashboard: true,
    enableOtpBypass: false,
    enablePromoCodeField: true,
    enableExternalIA: true,
    enableVidaV2: true,
    enableAnnouncementBoxAleph: true,
    enableDeleteAccount: true,
    enableUploadKtp: false,
  },
  [Environment.Staging]: {
    enableEkycCheck: true,
    enableNewFunnelLoanCalculator: true,
    enableRedirectPage: true,
    enableLanguageDropdown: false,
    enableAskToLoginOnLoanCalculator: false,
    enableAccountDashboard: true,
    enableOtpBypass: true,
    enablePromoCodeField: true,
    enableExternalIA: true,
    enableVidaV2: false,
    enableAnnouncementBoxAleph: true,
    enableDeleteAccount: true,
    enableUploadKtp: false,
  },
  [Environment.Production]: {
    enableEkycCheck: true,
    enableNewFunnelLoanCalculator: true,
    enableRedirectPage: true,
    enableLanguageDropdown: false,
    enableAskToLoginOnLoanCalculator: false,
    enableAccountDashboard: true,
    enableOtpBypass: false,
    enablePromoCodeField: true,
    enableExternalIA: true,
    enableVidaV2: false,
    enableAnnouncementBoxAleph: true,
    enableDeleteAccount: true,
    enableUploadKtp: false,
  },
}
