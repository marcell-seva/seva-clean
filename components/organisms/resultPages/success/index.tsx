/* eslint-disable react/no-children-prop */
import React, { useEffect, useState } from 'react'
import { getSessionStorage } from 'utils/handler/sessionStorage'
import styles from 'styles/components/organisms/success.module.scss'
import urls from 'helpers/urls'
import clsx from 'clsx'
import {
  CreditQualificationReviewParam,
  trackKualifikasiKreditSuccessResultPageView,
} from 'helpers/amplitude/seva20Tracking'
import { MoengageEventName, setTrackEventMoEngage } from 'helpers/moengage'
import dayjs from 'dayjs'
import {
  CustomerPreApprovalResponse,
  SimpleCarVariantDetail,
  trackDataCarType,
} from 'utils/types/utils'
import { LanguageCode, LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { getLocalStorage } from 'utils/handler/localStorage'
import { million, ten } from 'utils/helpers/const'
import { isIsoDateFormat } from 'utils/handler/regex'
import { HeaderMobile } from 'components/organisms'
import { BannerCard } from 'components/molecules/card/bannerCard'
import { Gap, IconCSA, IconDownload } from 'components/atoms'
import { CitySelectorModal, FooterMobile } from 'components/molecules'
import { getToken } from 'utils/handler/auth'
import { formatNumberByLocalization } from 'utils/handler/rupiah'
import { TrackerFlag } from 'utils/types/models'
import Image from 'next/image'
import { getCustomerAssistantWhatsAppNumber } from 'utils/handler/lead'
import { getCustomerInfoSeva } from 'utils/handler/customer'
import dynamic from 'next/dynamic'
import { getCities, getAnnouncementBox as gab } from 'services/api'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { useAnnouncementBoxContext } from 'services/context/announcementBoxContext'
import { useUtils } from 'services/context/utilsContext'

const ApprovalImageAcc = '/revamp/illustration/approve-acc.webp'
const ApprovalImageTaf = '/revamp/illustration/approve-taf.webp'
const LogoGooglePlay = '/revamp/icon/google-play.webp'
const LogoAppStore = '/revamp/icon/app-store.webp'

export const CreditQualificationSuccess = () => {
  const titleText = 'Instant Approval Kamu Disetujui'
  const [preApprovalResult] = useLocalStorage('preApprovalResult', '')
  const dateText = preApprovalResult?.fincoResultAt
  const dateIAResult =
    Number(
      dayjs(dateText).add(7, 'days').format('DD MMMM YYYY').substring(0, 2),
    ) > 20 &&
    Number(dayjs(dateText).format('DD MMMM YYYY').substring(0, 2)) < 20
      ? dayjs(dateText).date(20).format('DD MMMM YYYY')
      : dayjs(dateText).add(7, 'days').format('DD MMMM YYYY')
  const descText =
    `Hasil Instant Approval ini hanya berlaku hingga ` +
    dateIAResult +
    ` tanpa adanya perubahan data apapun. Agen SEVA akan segera membantu proses pembelian mobilmu.`
  const [isActive, setIsActive] = useState(false)
  const [isOpenCitySelectorModal, setIsOpenCitySelectorModal] = useState(false)
  const [resultPreApproval, setResultPreApproval]: any =
    useState<CustomerPreApprovalResponse>()
  const { dataAnnouncementBox, cities } = useUtils()
  const { showAnnouncementBox, saveShowAnnouncementBox } =
    useAnnouncementBoxContext()
  const [flag, setFlag] = useState<TrackerFlag>(TrackerFlag.Init)
  const [customerYearBorn, setCustomerYearBorn] = useState('')
  const dataCar: trackDataCarType | null = getSessionStorage(
    SessionStorageKey.PreviousCarDataBeforeLogin,
  )
  const referralCodeFromUrl: string | null = getLocalStorage(
    LocalStorageKey.referralTemanSeva,
  )

  const getAnnouncementBox = () => {
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
  }

  const checkDataResultPreApproval = () => {
    const response: CustomerPreApprovalResponse | null = getLocalStorage(
      LocalStorageKey.resultPreApproval,
    )
    if (response !== null) setResultPreApproval(response)
  }
  const trackCountly = async () => {
    let temanSevaStatus = 'No'
    if (referralCodeFromUrl) {
      temanSevaStatus = 'Yes'
    } else if (!!getToken()) {
      const response = await getCustomerInfoSeva()
      if (response[0].temanSevaTrxCode) {
        temanSevaStatus = 'Yes'
      }
    }
    trackEventCountly(CountlyEventNames.WEB_WA_DIRECT_CLICK, {
      PAGE_ORIGINATION: resultPreApproval?.leadOrigination
        ?.toLowerCase()
        .includes('multi')
        ? 'Instant Approval (Multi)'
        : 'Instant Approval (Reg)',
      SOURCE_BUTTON: 'CTA button Hubungi Agen SEVA',
      CAR_BRAND: resultPreApproval?.modelDetail.brand,
      CAR_MODEL: resultPreApproval?.modelDetail.model,
      CAR_VARIANT: resultPreApproval?.variantDetail.name,
      PELUANG_KREDIT_BADGE:
        dataCar?.PELUANG_KREDIT_BADGE &&
        dataCar?.PELUANG_KREDIT_BADGE === 'Green'
          ? 'Mudah disetujui'
          : dataCar?.PELUANG_KREDIT_BADGE &&
            dataCar?.PELUANG_KREDIT_BADGE === 'Red'
          ? 'Sulit disetujui'
          : 'Null',
      TENOR_OPTION: resultPreApproval?.loanTenure + ' Tahun',
      TENOR_RESULT:
        dataCar?.TENOR_RESULT && dataCar?.TENOR_RESULT === 'Green'
          ? 'Mudah disetujui'
          : dataCar?.TENOR_RESULT && dataCar?.TENOR_RESULT === 'Red'
          ? 'Sulit disetujui'
          : 'Null',
      KK_RESULT: 'Null',
      IA_RESULT: 'Approved',
      TEMAN_SEVA_STATUS: temanSevaStatus,
      INCOME_LOAN_CALCULATOR: 'Null',
      INCOME_KUALIFIKASI_KREDIT: 'Null',
      INCOME_CHANGE: 'Null',
      OCCUPATION: 'Null',
    })
  }
  const redirectWhatsapp = async () => {
    trackCountly()
    const loanTenure = resultPreApproval?.loanTenure
    const promoCode: string | undefined = resultPreApproval?.promoCode
    const brandModel = `${resultPreApproval?.modelDetail?.brand} ${resultPreApproval?.modelDetail?.model} ${resultPreApproval?.variantDetail?.name}`
    const loanDownPayment = formatNumberByLocalization(
      resultPreApproval!.loanDownPayment,
      LanguageCode.en,
      million,
      ten,
    )
    const loanMonthlyInstallment = formatNumberByLocalization(
      resultPreApproval!.loanMonthlyInstallment,
      LanguageCode.en,
      million,
      ten,
    )

    const messageWithPromo = `Halo, saya tertarik cek kualifikasi kredit untuk mobil ${brandModel} dengan DP sebesar Rp ${loanDownPayment} jt, cicilan per bulannya Rp ${loanMonthlyInstallment} jt, tenor ${loanTenure} tahun, dan kode promo ${promoCode}.`
    const messageWithoutPromo = `Halo, saya tertarik cek kualifikasi kredit untuk mobil ${brandModel} dengan DP sebesar Rp ${loanDownPayment} jt, cicilan per bulannya Rp ${loanMonthlyInstallment} jt dengan tenor ${loanTenure} tahun`
    const finalMessage =
      promoCode === '' || promoCode === undefined
        ? messageWithoutPromo
        : messageWithPromo
    const whatsAppUrl = await getCustomerAssistantWhatsAppNumber()

    window.open(`${whatsAppUrl}?text=${encodeURI(finalMessage)}`, '_blank')
  }

  const [simpleCarVariantDetails] =
    useLocalStorage<SimpleCarVariantDetail | null>(
      LocalStorageKey.SimpleCarVariantDetails,
      null,
    )

  const onClickPlayStore = () => {
    sendDataTrackerClickDownloadApps('Android')
    window.open(urls.googlePlayHref, '_blank')
  }

  const onClickAppStore = () => {
    sendDataTrackerClickDownloadApps('IOS')
    window.open(urls.appStoreHerf, '_blank')
  }

  const sendDataTrackerClickDownloadApps = (platform: string) => {
    const dataJourney =
      sessionStorage.getItem(SessionStorageKey.PageReferrerIA) || ''
    const origination =
      dataJourney === 'Multi Unit Kualifikasi Kredit Result'
        ? 'Multi IA Finish Page'
        : 'Instant Approval Finish Page'
    const data = {
      PAGE_ORIGINATION: origination,
      CAR_BRAND: resultPreApproval?.modelDetail.brand ?? '',
      CAR_MODEL: resultPreApproval?.modelDetail.model ?? '',
      CAR_VARIANT: resultPreApproval?.variantDetail.name ?? '',
      TENOR_OPTION: `${simpleCarVariantDetails?.loanTenure ?? 0} Tahun`,
      PLATFORM: platform,
      PAGE_REFERRER:
        sessionStorage.getItem(SessionStorageKey.PageReferrerIA) || '',
    }
    trackEventCountly(
      CountlyEventNames.WEB_INSTANT_APPROVAL_DOWNLOAD_APP_CLICK,
      data,
    )
  }

  const DownloadApp: React.FC = (): JSX.Element => (
    <div className={styles.slot}>
      <a
        href={urls.googlePlayHref}
        target="_blank"
        rel="noreferrer"
        className={styles.wrapperLogoGooglePlay}
        onClick={onClickPlayStore}
      >
        <Image
          src={LogoGooglePlay}
          alt="google-play"
          className={styles.logoGooglePlay}
          width={152}
          height={46}
        />
      </a>
      <a
        href={urls.appStoreHerf}
        target="_blank"
        rel="noreferrer"
        className={styles.wrapperLogoAppStore}
        onClick={onClickAppStore}
      >
        <Image
          src={LogoAppStore}
          alt="app-store"
          className={styles.logoAppStore}
          width={152}
          height={46}
        />
      </a>
    </div>
  )

  const getTotalIncome = () => {
    if (
      !!resultPreApproval?.monthlyIncome &&
      !!resultPreApproval?.spouseIncome
    ) {
      return (
        Number(resultPreApproval?.monthlyIncome) +
        Number(resultPreApproval?.spouseIncome)
      )
    } else if (
      !!resultPreApproval?.monthlyIncome &&
      !resultPreApproval?.spouseIncome
    ) {
      return Number(resultPreApproval?.monthlyIncome)
    } else {
      return 0
    }
  }

  const formattedIncome = (income: string) => {
    return `Rp${formatNumberByLocalization(
      Number(income),
      LanguageCode.id,
      1000000,
      10,
    )} Juta`
  }

  const getDataForTracker = (): CreditQualificationReviewParam => {
    return {
      Car_Brand: resultPreApproval?.modelDetail.brand ?? '',
      Car_Model: resultPreApproval?.modelDetail.model ?? '',
      Car_Variant: resultPreApproval?.variantDetail.name ?? '',
      DP: `Rp${formatNumberByLocalization(
        resultPreApproval?.loanDownPayment ?? 0,
        LanguageCode.id,
        1000000,
        10,
      )} Juta`,
      Total_Income: formattedIncome(String(getTotalIncome())),
      Monthly_Installment: `Rp${formatNumberByLocalization(
        resultPreApproval?.loanMonthlyInstallment ?? 0,
        LanguageCode.id,
        1000000,
        10,
      )} jt/bln`,
      Tenure: `${resultPreApproval?.loanTenure ?? 0} Tahun`,
      Promo: resultPreApproval?.promoCode,
      Year_Born: customerYearBorn,
      City: resultPreApproval?.city ?? '',
      Teman_SEVA_Ref_Code: resultPreApproval?.temanSevaTrxCode,
      Occupation: resultPreApproval?.occupation ?? '',
      Page_Origination: 'https://' + window.location.host + location.pathname,
    }
  }

  const trackAmplitudeAndMoengagePageView = () => {
    trackKualifikasiKreditSuccessResultPageView({
      ...getDataForTracker(),
      Total_Income: undefined,
      Page_Origination: undefined,
      Income: formattedIncome(String(resultPreApproval?.monthlyIncome ?? 0)),
    })
    setTrackEventMoEngage(
      MoengageEventName.view_kualifikasi_kredit_success_result_page,
      {
        ...getDataForTracker(),
        Total_Income: undefined,
        Page_Origination: undefined,
        Income: formattedIncome(String(resultPreApproval?.monthlyIncome ?? 0)),
      },
    )
  }

  const getCurrentUserInfo = () => {
    getCustomerInfoSeva()
      .then((response) => {
        // setLoadShimmer2(false)
        if (!!response[0].dob && isIsoDateFormat(response[0].dob)) {
          setCustomerYearBorn(response[0].dob.slice(0, 4))
        }
      })
      .catch((err) => {
        console.error(err)
        // setLoadShimmer2(false)
        // showToast()
      })
  }

  const sendDataTracker = () => {
    const data = {
      CAR_BRAND: resultPreApproval?.modelDetail.brand ?? '',
      CAR_MODEL: resultPreApproval?.modelDetail.model ?? '',
      CAR_VARIANT: resultPreApproval?.variantDetail.name ?? '',
      INSTANT_APPROVAL_RESULT: resultPreApproval?.status,
      FINANCING_COMPANY: resultPreApproval?.finco,
    }
    trackEventCountly(
      CountlyEventNames.WEB_INSTANT_APPROVAL_PAGE_RESULT_VIEW,
      data,
    )
  }

  useEffect(() => {
    checkDataResultPreApproval()
    if (!!getToken()) {
      getCurrentUserInfo()
    }
  }, [])

  useEffect(() => {
    document.body.style.overflowY = isActive ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflowY = 'auto'
    }
  }, [isActive])

  useEffect(() => {
    if (
      !!resultPreApproval &&
      !!customerYearBorn &&
      flag === TrackerFlag.Init
    ) {
      sendDataTracker()
      trackAmplitudeAndMoengagePageView()
      setFlag(TrackerFlag.Sent)
    }
  }, [resultPreApproval, customerYearBorn])

  useEffect(() => {
    getAnnouncementBox()
  }, [dataAnnouncementBox])

  return (
    <div className={styles.bundle}>
      <HeaderMobile
        isActive={isActive}
        setIsActive={setIsActive}
        style={{
          position: 'fixed',
        }}
        emitClickCityIcon={() => setIsOpenCitySelectorModal(true)}
        setShowAnnouncementBox={saveShowAnnouncementBox}
        isShowAnnouncementBox={showAnnouncementBox}
        pageOrigination="Instant Approval - Approved"
      />
      <div
        className={clsx({
          [styles.container]: !showAnnouncementBox,
          [styles.contentWithSpace]: showAnnouncementBox,
          [styles.announcementboxpadding]: showAnnouncementBox,
          [styles.announcementboxpadding]: false,
        })}
      >
        <div className={styles.resultSuccess}>
          <div className={styles.bundleImage}>
            <Image
              src={
                preApprovalResult?.finco &&
                preApprovalResult?.finco.toLowerCase() === 'acc'
                  ? ApprovalImageAcc
                  : ApprovalImageTaf
              }
              alt="approval-image"
              className={styles.approvalImage}
              width={200}
              height={134}
            />
          </div>
          <h2 className={styles.titleText}>
            Selamat, {resultPreApproval?.customerName}!
          </h2>
          <h2 className={styles.titleText}>{titleText}</h2>
          <p className={styles.descText}>{descText}</p>
          <div className={styles.redirect}>
            <h3 className={styles.headerCardText}>Jelajahi Seva</h3>
            <BannerCard
              title="Mulai Obrolan dengan Agen SEVA"
              subTitle="Tanya lebih lanjut dengan agen SEVA mengenai pengajuan kredit
              mobil kamu."
              onClick={() => redirectWhatsapp()}
              icon={<IconCSA width={24} height={24} color="#B4231E" />}
            />
            <Gap height={16} />
            <BannerCard
              isWithoutClick
              title="Download Aplikasi SEVA"
              subTitle=""
              icon={<IconDownload width={24} height={24} color="#B4231E" />}
              children={<DownloadApp />}
            />
          </div>
        </div>
        <FooterMobile pageOrigination="Instant Approval - Approved" />
      </div>
      <CitySelectorModal
        isOpen={isOpenCitySelectorModal}
        onClickCloseButton={() => setIsOpenCitySelectorModal(false)}
        cityListFromApi={cities}
        pageOrigination="Instant Approval - Approved"
        sourceButton="Location Icon (Navbar)"
      />
    </div>
  )
}
