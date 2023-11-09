import React, { useEffect, useState } from 'react'
import styles from 'styles/pages/credit-qualification-result.module.scss'

import {
  getSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'
import { AxiosResponse } from 'axios'
import clsx from 'clsx'
import { LanguageCode, LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { useProtectPage } from 'utils/hooks/useProtectPage/useProtectPage'
import { useRouter } from 'next/router'
import { getLocalStorage } from 'utils/handler/localStorage'
import { CityOtrOption, NewFunnelCarVariantDetails } from 'utils/types'
import { getToken } from 'utils/handler/auth'

import {
  AnnouncementBoxDataType,
  MobileWebTopMenuType,
  LoanCalculatorInsuranceAndPromoType,
  trackDataCarType,
} from 'utils/types/utils'
import { Triangle } from 'components/atoms/icon/Triangle'
import { Star } from 'components/atoms/icon/Star'
import { Firework } from 'components/atoms/icon/Firework'
import {
  cameraKtpUrl,
  ktpReviewUrl,
  loanCalculatorDefaultUrl,
  loanCalculatorWithCityBrandModelVariantUrl,
} from 'utils/helpers/routes'
import { formatNumberByLocalization } from 'utils/handler/rupiah'
import { HeaderMobile } from 'components/organisms'
import {
  Button,
  IconChevronDown,
  IconLoading,
  IconWhatsapp,
  Toast,
} from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { FooterStakeholder } from 'components/molecules/footerStakeholder'
import { CitySelectorModal } from 'components/molecules'
import { PopupCreditQualificationResult } from 'components/organisms/popoupCreditQualificationResult'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
import {
  PreviousButton,
  RouteName,
  saveDataForCountlyTrackerPageViewLC,
} from 'utils/navigate'
import Image from 'next/image'
import { getCarVariantDetailsById } from 'utils/handler/carRecommendation'
import { getCustomerInfoSeva, getCustomerKtpSeva } from 'utils/handler/customer'
import { getCustomerAssistantWhatsAppNumber } from 'utils/handler/lead'
import {
  getCities,
  getAnnouncementBox as gab,
  getMobileHeaderMenu,
  getMobileFooterMenu,
} from 'services/api'
import { serverSideManualNavigateToErrorPage } from 'utils/handler/navigateErrorPage'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import endpoints from 'helpers/endpoints'
import { useFinancialQueryData } from 'services/context/finnancialQueryContext'
import { Currency } from 'utils/handler/calculation'
import { useBadgePromo } from 'utils/hooks/usebadgePromo'
import { useUtils } from 'services/context/utilsContext'
import { useAnnouncementBoxContext } from 'services/context/announcementBoxContext'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { MobileWebFooterMenuType } from 'utils/types/props'

const MainImageGreenMale = '/revamp/illustration/credit-result-green-male.webp'
const MainImageGreenFemale =
  '/revamp/illustration/credit-result-green-female.webp'
const MainImageYellowMale =
  '/revamp/illustration/credit-result-yellow-male.webp'
const MainImageYellowFemale =
  '/revamp/illustration/credit-result-yellow-female.webp'
const MainImageRedBackground =
  '/revamp/illustration/credit-result-red-background.webp'
const MainImageMagnifier = '/revamp/illustration/credit-result-magnifier.webp'

export default function CreditQualificationResultPage({
  dataMobileMenu,
  dataFooter,
  dataCities,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  useProtectPage()
  const router = useRouter()
  const selectablePromo = getLocalStorage<LoanCalculatorInsuranceAndPromoType>(
    LocalStorageKey.SelectablePromo,
  )
  const { financialQuery } = useFinancialQueryData()
  const creditQualificationResultStorage: any =
    getLocalStorage(LocalStorageKey.CreditQualificationResult) ?? null
  const creditQualificationStatus =
    creditQualificationResultStorage?.creditQualificationStatus ?? ''
  const creditOccupationStatus =
    creditQualificationResultStorage?.occupation ?? ''
  const isOccupationPass = creditOccupationStatus.toLowerCase() === 'pass'
  const dataReviewLocalStorage = localStorage.getItem('qualification_credit')
  const dataReview = dataReviewLocalStorage
    ? JSON.parse(dataReviewLocalStorage)
    : null
  const [isActive, setIsActive] = useState(false)
  const [isOpenCitySelectorModal, setIsOpenCitySelectorModal] = useState(false)
  const {
    cities,
    saveCities,
    dataAnnouncementBox,
    saveDataAnnouncementBox,
    saveMobileWebTopMenus,
    saveMobileWebFooterMenus,
  } = useUtils()
  const { showAnnouncementBox, saveShowAnnouncementBox } =
    useAnnouncementBoxContext()
  const [isOpenPopup, setIsOpenPopup] = useState(false)
  const [isLoadingContinueApproval, setIsLoadingContinueApproval] =
    useState(false)
  const [isLoadingWhatsApp, setIsLoadingWhatsApp] = useState(false)
  const [carData, setCarData] = useState<NewFunnelCarVariantDetails | null>(
    null,
  )
  const [customerGender, setCustomerGender] = useState('male')
  const [isOpenToast, setIsOpenToast] = useState(false)
  const [toastMessage, setToastMessage] = useState(
    'Mohon maaf, terjadi kendala jaringan silahkan coba kembali lagi',
  )
  const { selectedPromoList } = useBadgePromo()

  const dataCar: trackDataCarType | null = getSessionStorage(
    SessionStorageKey.PreviousCarDataBeforeLogin,
  )

  const filterStorage: any = getLocalStorage(LocalStorageKey.CarFilter)

  const isUsingFilterFinancial =
    !!filterStorage?.age &&
    !!filterStorage?.downPaymentAmount &&
    !!filterStorage?.monthlyIncome &&
    !!filterStorage?.tenure
  const kkFlowType = getSessionStorage(SessionStorageKey.KKIAFlowType)
  const isInPtbcFlow = kkFlowType && kkFlowType === 'ptbc'
  const IsShowBadgeCreditOpportunity = getSessionStorage(
    SessionStorageKey.IsShowBadgeCreditOpportunity,
  )

  const checkCitiesData = () => {
    if (cities.length === 0) {
      saveCities(dataCities)
    }
  }

  const getAnnouncementBox = () => {
    gab({
      headers: {
        'is-login': getToken() ? 'true' : 'false',
      },
    }).then((res: any) => {
      saveDataAnnouncementBox(res.data)
    })
  }

  const getCarDetails = () => {
    if (dataReview?.variantId) {
      getCarVariantDetailsById(dataReview?.variantId).then((res) => {
        setCarData(res.data)
      })
    }
  }

  const getCurrentUserInfo = () => {
    getCustomerInfoSeva()
      .then((response) => {
        // setLoadShimmer2(false)
        if (!!response.data[0].gender) {
          setCustomerGender(response.data[0].gender)
        }
      })
      .catch((err) => {
        console.error(err)
        // setLoadShimmer2(false)
        // showToast()
      })
  }

  const generalTrack = () => {
    return {
      CAR_BRAND: carData?.modelDetail.brand,
      CAR_VARIANT: carData?.variantDetail.name,
      CAR_MODEL: carData?.modelDetail.model,
      INCOME_CHANGE:
        Number(financialQuery.monthlyIncome) ===
        Number(dataReview?.monthlyIncome)
          ? 'No'
          : 'Yes',
      INCOME_KUALIFIKASI_KREDIT: `Rp${Currency(
        Number(dataReview?.monthlyIncome),
      )}`,
      INCOME_LOAN_CALCULATOR: `Rp${Currency(
        Number(financialQuery.monthlyIncome),
      )}`,
      OCCUPATION: dataReview
        ? dataReview.occupations.toString().replace('&', 'and')
        : 'Null',
      KUALIFIKASI_KREDIT_RESULT: creditQualificationStatus,
    }
  }

  const trackCreditQualificationResult = () => {
    const track = {
      ...generalTrack(),
      INSURANCE_TYPE: selectablePromo?.selectedInsurance.label || 'Null',
      PROMO_AMOUNT: selectedPromoList ? selectedPromoList.length : 'Null',
    }

    if (isInPtbcFlow) {
      trackEventCountly(
        CountlyEventNames.WEB_PTBC_CREDIT_QUALIFICATION_RESULT_PAGE_VIEW,
      )
    } else {
      trackEventCountly(
        CountlyEventNames.WEB_CREDIT_QUALIFICATION_RESULT_PAGE_VIEW,
        track,
      )
    }
  }

  const trackCreditQualificationResultContinueIA = () => {
    const track = {
      ...generalTrack(),
      SOURCE_SECTION: isOpenPopup ? 'Pop Up Learn More' : 'Finish Page',
    }
    trackEventCountly(
      CountlyEventNames.WEB_CREDIT_QUALIFICATION_RESULT_PAGE_CONTINUE_INSTANT_APPROVAL_CLICK,
      track,
    )
  }

  const trackCreditQualificationResultFincapChange = () => {
    const track = {
      ...generalTrack(),
    }
    trackEventCountly(
      CountlyEventNames.WEB_CREDIT_QUALIFICATION_RESULT_PAGE_POPUP_CHANGE_FINCAP_CLICK,
      track,
    )
  }

  useEffect(() => {
    if (!creditQualificationResultStorage || !dataReviewLocalStorage) {
      router.replace(loanCalculatorDefaultUrl)
    } else {
      saveMobileWebTopMenus(dataMobileMenu)
      saveMobileWebFooterMenus(dataFooter)
      checkCitiesData()
      getAnnouncementBox()
      getCarDetails()
      getCurrentUserInfo()
      const timeout = setTimeout(() => {
        trackCreditQualificationResult()
      }, 500)
      return () => clearTimeout(timeout)
    }
  }, [])

  useEffect(() => {
    if (dataAnnouncementBox) {
      const isShowAnnouncement = getSessionStorage(
        getToken()
          ? SessionStorageKey.ShowWebAnnouncementLogin
          : SessionStorageKey.ShowWebAnnouncementNonLogin,
      )
      if (typeof isShowAnnouncement !== 'undefined') {
        saveShowAnnouncementBox(isShowAnnouncement as boolean)
      } else {
        saveShowAnnouncementBox(true)
      }
    } else {
      saveShowAnnouncementBox(false)
    }
  }, [dataAnnouncementBox])

  const getChipText = () => {
    if (
      creditQualificationStatus.toLowerCase() === 'sulit' ||
      !isOccupationPass
    ) {
      return 'Kualifikasi Kredit Sulit'
    } else if (creditQualificationStatus.toLowerCase() === 'sedang') {
      return 'Kualifikasi Kredit Sedang'
    } else if (creditQualificationStatus.toLowerCase() === 'mudah') {
      return 'Kualifikasi Kredit Mudah'
    } else {
      return 'Kualifikasi Kredit Sedang'
    }
  }

  const renderHeaderIcon = () => {
    if (
      creditQualificationStatus.toLowerCase() === 'sulit' ||
      !isOccupationPass
    ) {
      return (
        <>
          <div className={styles.headerIconLeft}>
            <Triangle width={12} height={12} color="#FED2B9" />
          </div>
          <div className={styles.headerIconRight}>
            <Triangle width={12} height={12} color="#FED2B9" />
          </div>
        </>
      )
    } else if (creditQualificationStatus.toLowerCase() === 'sedang') {
      return (
        <>
          <div className={styles.headerIconLeft}>
            <Star width={16} height={18} color="#F1C551" />
          </div>
          <div className={styles.headerIconRight}>
            <Firework width={30} height={30} color="#FCCC51" />
          </div>
        </>
      )
    } else if (creditQualificationStatus.toLowerCase() === 'mudah') {
      return (
        <>
          <div className={styles.headerIconLeft}>
            <Firework width={30} height={30} color="#5FC19E" />
          </div>
          <div className={styles.headerIconRight}>
            <Star width={13} height={15} color="#D8EDE6" />
          </div>
        </>
      )
    } else {
      return (
        <>
          <div className={styles.headerIconLeft}>
            <Star width={16} height={18} color="#F1C551" />
          </div>
          <div className={styles.headerIconRight}>
            <Firework width={30} height={30} color="#FCCC51" />
          </div>
        </>
      )
    }
  }

  const getHeading2Text = () => {
    if (
      creditQualificationStatus.toLowerCase() === 'sulit' ||
      !isOccupationPass
    ) {
      return 'Yah... Lumayan Mepet Nih'
    } else if (creditQualificationStatus.toLowerCase() === 'sedang') {
      return 'Hmm... Masih Bisa Dicoba'
    } else if (creditQualificationStatus.toLowerCase() === 'mudah') {
      return 'Yeay, Pilihanmu Cocok!'
    } else {
      return 'Hmm... Masih Bisa Dicoba'
    }
  }

  const getHeading3Text = () => {
    if (
      creditQualificationStatus.toLowerCase() === 'sulit' ||
      !isOccupationPass
    ) {
      return 'Jangan menyerah, SEVA akan bantu kamu menemukan solusi terbaik'
    } else if (creditQualificationStatus.toLowerCase() === 'sedang') {
      return 'Kredit mobil yang kamu ajukan punya peluang untuk mendapatkan persetujuan'
    } else if (creditQualificationStatus.toLowerCase() === 'mudah') {
      return 'Selamat! Mobil dan paket kredit yang kamu pilih sudah sesuai dengan profilmu'
    } else {
      return 'Kredit mobil yang kamu ajukan punya peluang untuk mendapatkan persetujuan'
    }
  }

  const getMainImageSource = () => {
    if (
      creditQualificationStatus.toLowerCase() === 'mudah' &&
      customerGender.toLowerCase() === 'male'
    ) {
      return MainImageGreenMale
    } else if (
      creditQualificationStatus.toLowerCase() === 'mudah' &&
      customerGender.toLowerCase() === 'female'
    ) {
      return MainImageGreenFemale
    } else if (
      creditQualificationStatus.toLowerCase() === 'sedang' &&
      customerGender.toLowerCase() === 'male'
    ) {
      return MainImageYellowMale
    } else if (
      creditQualificationStatus.toLowerCase() === 'sedang' &&
      customerGender.toLowerCase() === 'female'
    ) {
      return MainImageYellowFemale
    } else if (customerGender.toLowerCase() === 'male') {
      return MainImageYellowMale
    } else if (customerGender.toLowerCase() === 'female') {
      return MainImageYellowFemale
    }
  }

  const renderMainImage = () => {
    if (
      creditQualificationStatus.toLowerCase() === 'sulit' ||
      !isOccupationPass
    ) {
      return (
        <div
          className={clsx(styles.mainImageWrapper, styles.mainImageWrapperRed)}
        >
          <Image
            className={styles.mainImageIllustration}
            alt="credit-result-illustration"
            src={MainImageRedBackground}
            width={327.13}
            height={188.14}
          />
          <Image
            className={styles.carImageRed}
            alt="car-image"
            src={carData?.variantDetail?.images[0] || ''}
            width={86.84}
            height={65.3}
          />
          <Image
            className={styles.magnifierImage}
            alt="magnifier-illustration"
            src={MainImageMagnifier}
            width={155.88}
            height={141.09}
          />
        </div>
      )
    } else if (creditQualificationStatus.toLowerCase() === 'sedang') {
      return (
        <div
          className={clsx(
            styles.mainImageWrapper,
            styles.mainImageWrapperYellow,
          )}
        >
          <Image
            className={styles.mainImageIllustration}
            alt="credit-result-illustration"
            src={getMainImageSource() || ''}
            width={311}
            height={198.62}
          />
          <Image
            className={styles.carImage}
            alt="car-image"
            src={carData?.variantDetail?.images[0] || ''}
            width={86.84}
            height={65.3}
          />
        </div>
      )
    } else if (creditQualificationStatus.toLowerCase() === 'mudah') {
      return (
        <div
          className={clsx(
            styles.mainImageWrapper,
            styles.mainImageWrapperGreen,
          )}
        >
          <Image
            className={styles.mainImageIllustration}
            alt="credit-result-illustration"
            src={getMainImageSource() || ''}
            width={317.08}
            height={197.11}
          />
          <Image
            className={styles.carImage}
            alt="car-image"
            src={carData?.variantDetail?.images[0] || ''}
            width={86.84}
            height={65.3}
          />
        </div>
      )
    } else {
      return (
        <div
          className={clsx(
            styles.mainImageWrapper,
            styles.mainImageWrapperYellow,
          )}
        >
          <Image
            className={styles.mainImageIllustration}
            alt="credit-result-illustration"
            src={getMainImageSource() || ''}
            width={311}
            height={198.62}
          />
          <Image
            className={styles.carImage}
            alt="car-image"
            src={carData?.variantDetail?.images[0] || ''}
            width={86.84}
            height={65.3}
          />
        </div>
      )
    }
  }

  const onClickLearnMore = () => {
    setIsOpenPopup(true)
    trackEventCountly(
      CountlyEventNames.WEB_CREDIT_QUALIFICATION_RESULT_PAGE_LEARN_MORE_CLICK,
      { KUALIFIKASI_KREDIT_RESULT: creditQualificationStatus },
    )
  }

  const onClickContinueApproval = async () => {
    saveSessionStorage(
      SessionStorageKey.PageReferrerIA,
      'Kualifikasi Kredit Result',
    )
    saveSessionStorage(
      SessionStorageKey.PreviousPage,
      JSON.stringify({ refer: window.location.pathname }),
    )
    setIsLoadingContinueApproval(true)
    trackCreditQualificationResultContinueIA()
    try {
      const dataKTPUser = await getCustomerKtpSeva()
      saveSessionStorage(SessionStorageKey.OCRKTP, 'kualifikasi-kredit')
      if (dataKTPUser.data.data.length > 0) {
        saveSessionStorage(SessionStorageKey.KTPUploaded, 'uploaded')
        saveSessionStorage(
          SessionStorageKey.LastVisitedPageKKIAFlow,
          window.location.pathname,
        )
        router.push(ktpReviewUrl)
      } else {
        saveSessionStorage(
          SessionStorageKey.LastVisitedPageKKIAFlow,
          window.location.pathname,
        )
        router.push(cameraKtpUrl)
        saveSessionStorage(SessionStorageKey.KTPUploaded, 'not upload')
        router.push(cameraKtpUrl)
      }
    } catch (e: any) {
      if (e?.response?.data?.code === 'NO_NIK_REGISTERED') {
        saveSessionStorage(SessionStorageKey.KTPUploaded, 'not upload')
        saveSessionStorage(
          SessionStorageKey.LastVisitedPageKKIAFlow,
          window.location.pathname,
        )
        router.push(cameraKtpUrl)
      } else if (e?.response?.data?.message) {
        setIsLoadingContinueApproval(false)
        setToastMessage(`${e?.response?.data?.message}`)
        setIsOpenToast(true)
      } else {
        setIsLoadingContinueApproval(false)
        setToastMessage(
          'Mohon maaf, terjadi kendala jaringan silahkan coba kembali lagi',
        )
        setIsOpenToast(true)
      }
    }
  }

  const trackCountly = async () => {
    const referralCodeFromUrl: string | null = getLocalStorage(
      LocalStorageKey.referralTemanSeva,
    )
    let temanSevaStatus = 'No'
    if (referralCodeFromUrl) {
      temanSevaStatus = 'Yes'
    } else if (!!getToken()) {
      const response = await getCustomerInfoSeva()
      if (response.data[0].temanSevaTrxCode) {
        temanSevaStatus = 'Yes'
      }
    }
    if (dataCar) {
      trackEventCountly(CountlyEventNames.WEB_WA_DIRECT_CLICK, {
        PAGE_ORIGINATION: 'Kualifikasi Kredit Result',
        SOURCE_BUTTON: 'CTA button Hubungi Agen SEVA',
        CAR_BRAND: carData?.modelDetail.brand,
        CAR_MODEL: carData?.modelDetail.model,
        CAR_VARIANT: carData?.variantDetail.name,
        PELUANG_KREDIT_BADGE: !dataCar?.IA_FLOW.toLowerCase().includes('multi')
          ? isUsingFilterFinancial && IsShowBadgeCreditOpportunity
            ? dataCar?.PELUANG_KREDIT_BADGE
            : isUsingFilterFinancial && IsShowBadgeCreditOpportunity
            ? dataCar?.PELUANG_KREDIT_BADGE
            : 'Null'
          : 'Null',

        TENOR_OPTION: dataReview?.loanTenure + ' Tahun',
        TENOR_RESULT: !dataCar?.IA_FLOW.toLowerCase().includes('multi')
          ? dataReview?.loanRank === 'Green'
            ? 'Mudah disetujui'
            : dataReview?.loanRank === 'Red'
            ? 'Sulit disetujui'
            : 'Null'
          : 'Null',
        IA_RESULT: 'Null',
        TEMAN_SEVA_STATUS: temanSevaStatus,
        INCOME_LOAN_CALCULATOR:
          !dataCar?.IA_FLOW.toLowerCase().includes('multi') &&
          dataCar?.INCOME_LC
            ? `Rp${Currency(dataCar?.INCOME_LC)}`
            : 'Null',
        INCOME_KUALIFIKASI_KREDIT:
          !dataCar?.IA_FLOW.toLowerCase().includes('multi') &&
          dataCar?.INCOME_KK
            ? `Rp${Currency(dataCar?.INCOME_KK)}`
            : !dataCar?.IA_FLOW.toLowerCase().includes('multi')
            ? `Rp${Currency(dataCar.INCOME_LC)}`
            : 'Null', // if there is no changes
        INCOME_CHANGE: !dataCar?.IA_FLOW.toLowerCase().includes('multi')
          ? dataCar?.INCOME_KK && dataCar?.INCOME_KK != dataCar?.INCOME_LC
            ? 'Yes'
            : 'No'
          : 'Null',
        OCCUPATION: dataReview?.occupations.includes('&')
          ? dataReview?.occupations.replace('&', 'and')
          : dataReview?.occupations,
        KK_RESULT: creditQualificationStatus,
      })
    }
  }
  const onClickWhatsapp = async () => {
    trackCountly()
    const carName = `${carData?.modelDetail?.brand} ${carData?.modelDetail?.model} ${carData?.variantDetail?.name}`
    const dpAmount = Currency(dataReview.loanDownPayment) ?? '-'
    const installment = Currency(dataReview.loanMonthlyInstallment) ?? '-'
    let message = `Halo saya tertarik melakukan kualifikasi kredit untuk ${carName} dengan DP sebesar Rp${dpAmount}, cicilan per bulannya Rp${installment}, dan tenor ${
      dataReview?.loanTenure ?? '-'
    } tahun.`

    if (
      !!selectablePromo?.selectedPromo &&
      selectablePromo?.selectedPromo.length > 0 &&
      !!selectablePromo?.dpDiscount
    ) {
      message =
        message +
        ` Saya juga ingin menggunakan promo ${selectablePromo.selectedPromo
          .map((x) => x.promo)
          .join(', ')}, dan diskon unit sebesar Rp${Currency(
          selectablePromo.dpDiscount,
        )}.`
    } else if (!!dataReview?.promoCode && !!dataReview?.temanSevaTrxCode) {
      message =
        message +
        ` Serta menggunakan promo ${dataReview?.promoCode} dan kode referral ${dataReview?.temanSevaTrxCode}.`
    } else if (!!dataReview?.promoCode && !dataReview?.temanSevaTrxCode) {
      message = message + ` Serta menggunakan promo ${dataReview?.promoCode}.`
    } else if (!dataReview?.promoCode && !!dataReview?.temanSevaTrxCode) {
      message =
        message +
        ` Serta menggunakan kode referral ${dataReview?.temanSevaTrxCode}.`
    }
    setIsLoadingWhatsApp(true)
    const whatsAppUrl = await getCustomerAssistantWhatsAppNumber()
    setIsLoadingWhatsApp(false)
    window.open(`${whatsAppUrl}?text=${encodeURI(message)}`, '_blank')
  }

  const onClickClosePopup = () => {
    setIsOpenPopup(false)
  }

  const onDismissPopup = () => {
    setIsOpenPopup(false)
  }

  const getLoanCalculatorDestinationUrl = () => {
    const cityNameSlug = dataReview?.citySelector
      .toLowerCase()
      .trim()
      .replace(/ +/g, '-')
    const brandSlug = carData?.modelDetail.brand
      .toLowerCase()
      .trim()
      .replace(/ +/g, '-')
    const modelSlug = carData?.modelDetail.model
      .toLowerCase()
      .trim()
      .replace(/ +/g, '-')
    const variantSlug = carData?.variantDetail.name
      .toLowerCase()
      .trim()
      .replace(/ +/g, '-')
      .replace('/', '')
    if (cityNameSlug && brandSlug && modelSlug && variantSlug) {
      return loanCalculatorWithCityBrandModelVariantUrl
        .replace(':cityName', cityNameSlug)
        .replace(':brand', brandSlug)
        .replace(':model', modelSlug)
        .replace(':variant', variantSlug)
    }
    return loanCalculatorWithCityBrandModelVariantUrl.replace(
      '/:cityName/:brand/:model/:variant',
      '',
    )
  }

  if (!creditOccupationStatus) return <></>

  return (
    <>
      <Seo
        title="SEVA - Beli Mobil Terbaru Dengan Cicilan Kredit Terbaik"
        description="Beli mobil terbaru dari Toyota, Daihatsu, BMW dengan Instant Approval*. Proses Aman & Mudah✅ Terintegrasi dengan ACC & TAF✅ SEVA member of ASTRA"
        image={defaultSeoImage}
      />
      <div className={styles.container}>
        <HeaderMobile
          isActive={isActive}
          setIsActive={setIsActive}
          style={{ withBoxShadow: true, position: 'fixed' }}
          emitClickCityIcon={() => setIsOpenCitySelectorModal(true)}
          setShowAnnouncementBox={saveShowAnnouncementBox}
          isShowAnnouncementBox={showAnnouncementBox}
          pageOrigination={RouteName.KKResult}
        />
        <div
          className={clsx({
            [styles.content]: true,
            [styles.contentWithAnnouncementBox]: showAnnouncementBox,
          })}
        >
          <div className={styles.chipAndIconWrapper}>
            <div
              className={clsx({
                [styles.chipWrapper]: true,
                [styles.redChip]:
                  creditQualificationStatus.toLowerCase() === 'sulit' ||
                  !isOccupationPass,
                [styles.yellowChip]:
                  creditQualificationStatus.toLowerCase() === 'sedang' ||
                  creditQualificationStatus.toLowerCase() === '',
                [styles.greenChip]:
                  creditQualificationStatus.toLowerCase() === 'mudah',
              })}
            >
              <span className={styles.chipText}>{getChipText()}</span>
            </div>
            {renderHeaderIcon()}
          </div>

          <div className={styles.headingSection}>
            <h2 className={styles.heading2}>{getHeading2Text()}</h2>
            <h3 className={styles.heading3}>{getHeading3Text()}</h3>
            <button
              className={styles.learnMoreButton}
              onClick={onClickLearnMore}
            >
              <span className={styles.smallButtonText}>
                Pelajari Lebih Lanjut
              </span>
              <div className={styles.iconWrapper}>
                <IconChevronDown width={16} height={16} />
              </div>
            </button>
          </div>

          {renderMainImage()}

          <span className={clsx(styles.bodyText, styles.subtitle)}>
            Mau hasil yang pasti dan cepat secara langsung dari perusahaan
            pembiayaan Astra? Yuk, lanjut ke tahap Instant Approval!
          </span>

          <div className={styles.buttonSection}>
            <Button
              version={ButtonVersion.PrimaryDarkBlue}
              size={ButtonSize.Big}
              onClick={onClickContinueApproval}
              disabled={isLoadingContinueApproval}
              loading={isLoadingContinueApproval}
            >
              Lanjut Instant Approval
            </Button>
            <Button
              version={ButtonVersion.Secondary}
              size={ButtonSize.Big}
              onClick={onClickWhatsapp}
              loading={isLoadingWhatsApp}
            >
              <div className={styles.whatsappButtonContent}>
                <div className={styles.iconWrapper}>
                  <IconWhatsapp width={16} height={16} />
                </div>
                Hubungi Agen SEVA
              </div>
            </Button>
          </div>
        </div>
        <FooterStakeholder />
      </div>

      <CitySelectorModal
        isOpen={isOpenCitySelectorModal}
        onClickCloseButton={() => setIsOpenCitySelectorModal(false)}
        cityListFromApi={cities}
        pageOrigination={RouteName.KKResult}
      />
      <PopupCreditQualificationResult
        isOpen={isOpenPopup}
        onClickClosePopup={onClickClosePopup}
        onDismissPopup={onDismissPopup}
        loadCtaButton={isLoadingContinueApproval}
        loanCalculatorDestinationUrl={getLoanCalculatorDestinationUrl()}
        onClickContinueApproval={onClickContinueApproval}
        onClickChangeCreditPlan={() => {
          trackCreditQualificationResultFincapChange()
          saveDataForCountlyTrackerPageViewLC(PreviousButton.PopUpUbahData)
        }}
      />
      <Toast
        width={339}
        open={isOpenToast}
        text={toastMessage}
        typeToast={'error'}
        onCancel={() => setIsOpenToast(false)}
        closeOnToastClick
      />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<{
  dataMobileMenu: MobileWebTopMenuType[]
  dataFooter: MobileWebFooterMenuType[]
  dataCities: CityOtrOption[]
}> = async (ctx) => {
  ctx.res.setHeader(
    'Cache-Control',
    'public, s-maxage=59, stale-while-revalidate=3000',
  )

  try {
    const [menuMobileRes, footerRes, cityRes]: any = await Promise.all([
      getMobileHeaderMenu(),
      getMobileFooterMenu(),
      getCities(),
    ])

    return {
      props: {
        dataMobileMenu: menuMobileRes.data,
        dataFooter: footerRes.data,
        dataCities: cityRes,
      },
    }
  } catch (e: any) {
    return serverSideManualNavigateToErrorPage(e?.response?.status)
  }
}
