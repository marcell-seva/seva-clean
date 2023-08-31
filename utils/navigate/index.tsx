import { valueForUserTypeProperty } from 'helpers/countly/countly'
import Router from 'next/router'
import { use } from 'react'
import { SessionStorageKey } from 'utils/enum'
import {
  getSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'
import { carResultsUrl, creditQualificationUrl } from 'utils/helpers/routes'
import urls from 'utils/helpers/url'

enum RouteName {
  Homepage = 'Homepage',
  PLP = 'PLP',
  PDPRingkasan = 'PDP - Ringkasan',
  PDPSpesifikasi = 'PDP - Spesifikasi',
  PDPHarga = 'PDP - Harga',
  PDPKredit = 'PDP - Kredit',
  LoanCalculator = 'Loan Calculator',
  KualifikasiKredit = 'Loan Calculator - Kualifikasi Kredit',
  KKResult = 'Kualifikasi Kredit - Result',
  IAWaitingForResult = 'Instant Approval - Waiting For Result',
  IAAPProved = 'Instant Approval - Approved',
  IARejected = 'Instant Approval - Rejected',
  MultiUnitForm = 'Multi unit - Form',
  MultiUnitResult = 'Multi unit - Result',
  ProfilePage = 'Profile Page',
  FasilitasDanaLanding = 'Fasilitas Dana - Landing',
  SalesDashboard = 'Sales Dashboard',
  TSDashboard = 'Teman SEVA - Dashboard',
  TSAcitivity = 'Teman SEVA - Activity',
  TSReferralCode = 'Teman SEVA - Referral Code',
  TSSkema1 = 'Teman SEVA - Skema 1',
  TSSkema2 = 'Teman SEVA - Skema 2',
  TSSkema3 = 'Teman SEVA - Skema 3',
  TSSkema4 = 'Teman SEVA - Skema 4',
}

export enum PreviousButton {
  SmartSearch = 'Cari Mobil - Smart Search',
  SevaSteps = 'Pilih Mobil Impian - SEVA Steps',
  BottomSection = 'Cari Mobil - Bottom Section',
  HamburgerMenu = 'Cari Mobil; Mobil Baru - Hamburger Menu',
  SearchBar = 'Search bar',
  IAWaitingForResult = 'Instant Approval - Waiting For Result',
  undefined = '',
  SearchIcon = 'Search icon',
  CarRecommendation = 'Car recommendation',
  CarOfTheMonth = 'Car of the month',
  ProductCard = 'Product card',
  CarRecommendationCta = 'Rekomendasi - Hitung Kemampuan',
  SevaStepsCalculate = 'SEVA steps - Hitung Kemampuan',
  SevaStepsQualification = 'SEVA steps - Kualifikasi Kredit',
  SevaBelowSectionCalculate = 'SEVA below section - Hitung Kemampuan',
  ProductCardCalculate = 'Product card - Hitung Kemampuan',
  MainTopCta = 'Main Top CTA',
  VariantPriceList = 'Variant pricelist',
  LeadsForm = 'Leads form',
  PopUpUbahData = 'Pop Up Ubah Data',
}

export const defineRouteName = (pathname: string) => {
  if (pathname.includes('mobil-baru')) {
    if (pathname.length > 12) {
      if (pathname.includes('spesifikasi')) {
        return RouteName.PDPSpesifikasi
      } else if (pathname.includes('harga')) {
        return RouteName.PDPHarga
      } else if (pathname.includes('kredit')) {
        return RouteName.PDPKredit
      } else {
        return RouteName.PDPRingkasan
      }
    }

    return RouteName.PLP
  }

  if (pathname.includes('kalkulator-kredit')) {
    return RouteName.LoanCalculator
  }

  if (pathname.includes('kualifikasi-kredit')) {
    if (pathname.includes('result')) {
      return RouteName.KKResult
    }
    return RouteName.KualifikasiKredit
  }

  if (pathname.includes('instant-approval')) {
    if (pathname.includes('process')) {
      return RouteName.IAWaitingForResult
    }
    if (pathname.includes('success')) {
      return RouteName.IAAPProved
    }
    if (pathname.includes('rejected')) {
      return RouteName.IARejected
    }
  }

  if (pathname.includes('multi-unit')) {
    if ('result') {
      return RouteName.MultiUnitResult
    }
    return RouteName.MultiUnitForm
  }

  if (pathname.includes('akun/profil')) {
    return RouteName.ProfilePage
  }

  if (pathname.includes('fasilitas-dana')) {
    return RouteName.FasilitasDanaLanding
  }

  if (pathname.includes('sales-dahsboard')) {
    return RouteName.SalesDashboard
  }

  if (pathname.includes('teman-seva')) {
    if (pathname.includes('dashboard')) {
      if (pathname.includes('skema-1')) {
        return RouteName.TSSkema1
      }
      if (pathname.includes('skema-2')) {
        return RouteName.TSSkema2
      }
      if (pathname.includes('skema-3')) {
        return RouteName.TSSkema3
      }
      if (pathname.includes('skema-4')) {
        return RouteName.TSSkema4
      }
      return RouteName.TSDashboard
    }
    if (pathname.includes('aktivitas-akun')) {
      return RouteName.TSAcitivity
    }
    if (pathname.includes('referral-code')) {
      return RouteName.TSReferralCode
    }
  }

  return RouteName.Homepage
}

export const navigateToPLP = (
  source: PreviousButton = PreviousButton.undefined,
  option?: any,
  navigate: boolean = true,
) => {
  let refer = defineRouteName(Router.pathname)

  const dataPrevPage = { refer, source }
  saveSessionStorage(
    SessionStorageKey.PreviousPage,
    JSON.stringify(dataPrevPage),
  )

  if (!navigate) return
  return Router.push({ pathname: urls.internalUrls.carResultsUrl, ...option })
}

export const navigateToKK = (option?: any) => {
  const source = ''
  const refer = defineRouteName(location.pathname)

  const dataPrevPage = { refer, source }
  saveSessionStorage(
    SessionStorageKey.PreviousPage,
    JSON.stringify(dataPrevPage),
  )

  return Router.push({ pathname: creditQualificationUrl, ...option })
}

export const saveDataForCountlyTrackerPageViewPDP = (
  previousButton: PreviousButton,
) => {
  saveSessionStorage(
    SessionStorageKey.PageReferrerPDP,
    defineRouteName(window.location.pathname),
  )
  saveSessionStorage(SessionStorageKey.PreviousSourceButtonPDP, previousButton)
}

export const saveDataForCountlyTrackerPageViewLC = (
  previousButton: PreviousButton,
) => {
  saveSessionStorage(
    SessionStorageKey.PageReferrerLC,
    defineRouteName(window.location.pathname),
  )
  saveSessionStorage(SessionStorageKey.PreviousSourceSectionLC, previousButton)
}
