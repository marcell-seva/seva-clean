/* eslint-disable react/no-children-prop */
import React, { useEffect, useState } from 'react'
import styles from 'styles/components/organisms/rejected.module.scss'

import { getSessionStorage } from 'utils/handler/sessionStorage'
import clsx from 'clsx'

import { getLocalStorage } from 'utils/handler/localStorage'
import { trackKualifikasiKreditRejectResultPageView } from 'helpers/amplitude/seva20Tracking'
import { MoengageEventName, setTrackEventMoEngage } from 'helpers/moengage'
import { useRouter } from 'next/router'
import {
  CustomerPreApprovalResponse,
  trackDataCarType,
} from 'utils/types/utils'
import { LanguageCode, LocalStorageKey, SessionStorageKey } from 'utils/enum'

import { isIsoDateFormat } from 'utils/handler/regex'
import { BannerCard } from 'components/molecules/card/bannerCard'
import { Gap, IconCSA } from 'components/atoms'
import { IconHome } from 'components/atoms/icon/Home'
import { CitySelectorModal, FooterMobile } from 'components/molecules'
import { getToken } from 'utils/handler/auth'
import {
  formatNumberByLocalization,
  replacePriceSeparatorByLocalization,
} from 'utils/handler/rupiah'
import { TrackerFlag } from 'utils/types/models'
import { HeaderMobile } from 'components/organisms'
import {
  PreviousButton,
  RouteName,
  saveDataForCountlyTrackerPageViewHomepage,
} from 'utils/navigate'
import Image from 'next/image'
import { getCustomerInfoSeva } from 'utils/handler/customer'
import { getCustomerAssistantWhatsAppNumber } from 'utils/handler/lead'
import dynamic from 'next/dynamic'
import { getCities, getAnnouncementBox as gab } from 'services/api'
import { CreditQualificationReviewParam } from 'utils/types/props'
import dynamic from 'next/dynamic'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { useAnnouncementBoxContext } from 'services/context/announcementBoxContext'
import { useUtils } from 'services/context/utilsContext'

const RejectedImage = '/revamp/illustration/rejected-approval.webp'

interface Props {
  onPage: string
}

export const CreditQualificationRejected = ({ onPage }: Props) => {
  const titleText = 'Terima kasih, Agen SEVA akan segera menghubungimu'
  const descText =
    'Maaf, datamu belum berhasil mendapatkan persetujuan secara instan. Tapi jangan khawatir, SEVA tetap akan membantu proses kredit mobil impianmu. Pastikan nomor HPmu selalu aktif ya!'
  const router = useRouter()
  const [isActive, setIsActive] = useState(false)
  const [isOpenCitySelectorModal, setIsOpenCitySelectorModal] = useState(false)
  const [customerYearBorn, setCustomerYearBorn] = useState('')
  const [resultPreApproval, setResultPreApproval] =
    useState<CustomerPreApprovalResponse>()
  const { dataAnnouncementBox, cities } = useUtils()
  const { showAnnouncementBox, saveShowAnnouncementBox } =
    useAnnouncementBoxContext()

  const [flag, setFlag] = useState<TrackerFlag>(TrackerFlag.Init)

  const referralCodeFromUrl: string | null = getLocalStorage(
    LocalStorageKey.referralTemanSeva,
  )
  const dataCar: trackDataCarType | null = getSessionStorage(
    SessionStorageKey.PreviousCarDataBeforeLogin,
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

  const getCurrentUserInfo = () => {
    getCustomerInfoSeva()
      .then((response) => {
        if (!!response[0].dob && isIsoDateFormat(response[0].dob)) {
          setCustomerYearBorn(response[0].dob.slice(0, 4))
        }
      })
      .catch((err) => {
        throw new Error(err)
      })
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
      IA_RESULT: onPage === 'IA-rejected' ? 'Rejected' : 'Null',
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
    const loanDownPayment = replacePriceSeparatorByLocalization(
      resultPreApproval!.loanDownPayment,
      LanguageCode.id,
    )
    const loanMonthlyInstallment = replacePriceSeparatorByLocalization(
      resultPreApproval!.loanMonthlyInstallment,
      LanguageCode.id,
    )
    const discountUnit = replacePriceSeparatorByLocalization(
      resultPreApproval!.dpDiscount,
      LanguageCode.id,
    )

    const selectedPromo = resultPreApproval!.selectedPromo?.toString()

    if (onPage === 'IA-rejected') {
      const messageWithPromo = `Halo saya tertarik melakukan instant approval untuk ${brandModel} dengan DP sebesar Rp${loanDownPayment}, cicilan per bulannya Rp${loanMonthlyInstallment} tenor ${loanTenure} tahun, dan kode promo ${promoCode}.`
      const messageWithoutPromo = `Halo saya tertarik melakukan instant approval untuk ${brandModel} dengan DP sebesar Rp${loanDownPayment}, cicilan per bulannya Rp${loanMonthlyInstallment}, dan tenor ${loanTenure} tahun.`
      const messageWithDiscountUnit = ` Saya juga ingin menggunakan promo ${selectedPromo?.replaceAll(
        ',',
        ', ',
      )}, dan diskon unit sebesar Rp${discountUnit}.`
      let finalMessage
      if (promoCode === '' || promoCode === undefined) {
        finalMessage = messageWithoutPromo
      } else {
        finalMessage = messageWithPromo
      }
      if (
        resultPreApproval?.selectedPromo &&
        resultPreApproval?.selectedPromo?.length > 0 &&
        resultPreApproval?.dpDiscount !== 0
      ) {
        finalMessage = finalMessage + messageWithDiscountUnit
      }
      const whatsAppUrl = await getCustomerAssistantWhatsAppNumber()

      window.open(`${whatsAppUrl}?text=${encodeURI(finalMessage)}`, '_blank')
    } else {
      const messageWithPromo = `Halo, saya tertarik cek kualifikasi kredit untuk mobil ${brandModel} dengan DP sebesar Rp${loanDownPayment} jt, cicilan per bulannya Rp${loanMonthlyInstallment} jt, tenor ${loanTenure} tahun, dan kode promo ${promoCode}.`
      const messageWithoutPromo = `Halo, saya tertarik cek kualifikasi kredit untuk mobil ${brandModel} dengan DP sebesar Rp${loanDownPayment} jt, cicilan per bulannya Rp${loanMonthlyInstallment} jt dengan tenor ${loanTenure} tahun`
      const finalMessage =
        promoCode === '' || promoCode === undefined
          ? messageWithoutPromo
          : messageWithPromo
      const whatsAppUrl = await getCustomerAssistantWhatsAppNumber()

      window.open(`${whatsAppUrl}?text=${encodeURI(finalMessage)}`, '_blank')
    }
  }

  const checkDataResultPreApproval = () => {
    const response: CustomerPreApprovalResponse | null = getLocalStorage(
      LocalStorageKey.resultPreApproval,
    )
    if (response !== null) setResultPreApproval(response)
    // else router.push('/kalkulator-kredit')
  }

  const trackAmplitudeAndMoengagePageView = () => {
    trackKualifikasiKreditRejectResultPageView({
      ...getDataForTracker(),
      Total_Income: undefined,
      Page_Origination: undefined,
      Income: formattedIncome(String(resultPreApproval?.monthlyIncome ?? 0)),
    })
    setTrackEventMoEngage(
      MoengageEventName.view_kualifikasi_kredit_reject_result_page,
      {
        ...getDataForTracker(),
        Total_Income: undefined,
        Page_Origination: undefined,
        Income: formattedIncome(String(resultPreApproval?.monthlyIncome ?? 0)),
      },
    )
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

  const sendDataTrackerBackToHome = () => {
    const data = {
      CAR_BRAND: resultPreApproval?.modelDetail.brand ?? '',
      CAR_MODEL: resultPreApproval?.modelDetail.model ?? '',
      CAR_VARIANT: resultPreApproval?.variantDetail.name ?? '',
    }
    trackEventCountly(
      CountlyEventNames.WEB_INSTANT_APPROVAL_PAGE_FINISH_BACK_TO_HOMEPAGE_CLICK,
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
    getAnnouncementBox()
  }, [dataAnnouncementBox])

  useEffect(() => {
    if (resultPreApproval) sendDataTracker()
  }, [resultPreApproval])

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
      trackAmplitudeAndMoengagePageView()
      setFlag(TrackerFlag.Sent)
    }
  }, [resultPreApproval, customerYearBorn])

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
        pageOrigination={RouteName.IARejected}
      />
      <div
        className={clsx({
          [styles.container]: !showAnnouncementBox,
          [styles.contentWithSpace]: showAnnouncementBox,
          [styles.announcementboxpadding]: showAnnouncementBox,
          [styles.announcementboxpadding]: false,
        })}
      >
        <div className={styles.resultRejected}>
          <div className={styles.bundleImage}>
            <Image
              src={RejectedImage}
              alt="approval-image"
              className={styles.rejectedImage}
            />
          </div>
          <h2 className={styles.titleText}>{titleText}</h2>
          <p className={styles.descText}>{descText}</p>
          <div className={styles.redirect}>
            <h3 className={styles.headerCardText}>Langkah selanjutnya</h3>
            <BannerCard
              title="Mulai Obrolan dengan Agen SEVA"
              subTitle="Tanya lebih lanjut dengan agen SEVA mengenai pengajuan kredit
              mobil kamu."
              onClick={() => redirectWhatsapp()}
              icon={<IconCSA width={24} height={24} color="#B4231E" />}
            />
            <Gap height={16} />
            <BannerCard
              title="Kembali ke Halaman Utama"
              subTitle="Jelajahi lebih lanjut layanan lain dari SEVA."
              icon={<IconHome width={24} height={24} color="#B4231E" />}
              onClick={() => {
                sendDataTrackerBackToHome()
                saveDataForCountlyTrackerPageViewHomepage(
                  PreviousButton.ButtonBackToHomepage,
                )
                router.push('/')
              }}
            />
          </div>
        </div>
      </div>
      <FooterMobile pageOrigination={RouteName.IARejected} />
      <CitySelectorModal
        isOpen={isOpenCitySelectorModal}
        onClickCloseButton={() => setIsOpenCitySelectorModal(false)}
        cityListFromApi={cities}
        pageOrigination={RouteName.IARejected}
        sourceButton="Location Icon (Navbar)"
      />
    </div>
  )
}
