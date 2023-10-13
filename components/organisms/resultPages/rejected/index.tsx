/* eslint-disable react/no-children-prop */
import React, { useEffect, useState } from 'react'
import styles from 'styles/components/organisms/rejected.module.scss'

import { getSessionStorage } from 'utils/handler/sessionStorage'
import clsx from 'clsx'

import { getLocalStorage } from 'utils/handler/localStorage'
import {
  CreditQualificationReviewParam,
  trackKualifikasiKreditRejectResultPageView,
  trackKualifikasiKreditWaDirectClick,
} from 'helpers/amplitude/seva20Tracking'
import { MoengageEventName, setTrackEventMoEngage } from 'helpers/moengage'
import { AxiosResponse } from 'axios'
import { useRouter } from 'next/router'
import { CityOtrOption } from 'utils/types'
import {
  AnnouncementBoxDataType,
  CustomerPreApprovalResponse,
} from 'utils/types/utils'
import { LanguageCode, LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { api } from 'services/api'
import { isIsoDateFormat } from 'utils/handler/regex'
import { million, ten } from 'utils/helpers/const'
import { BannerCard } from 'components/molecules/card/bannerCard'
import { Gap, IconCSA } from 'components/atoms'
import { IconHome } from 'components/atoms/icon/Home'
import { CitySelectorModal, FooterMobile } from 'components/molecules'
import { getToken } from 'utils/handler/auth'
import { formatNumberByLocalization } from 'utils/handler/rupiah'
import { TrackerFlag } from 'utils/types/models'
import { HeaderMobile } from 'components/organisms'
import {
  PreviousButton,
  saveDataForCountlyTrackerPageViewHomepage,
} from 'utils/navigate'
import Image from 'next/image'
import { getCustomerInfoSeva } from 'utils/handler/customer'
import { getCustomerAssistantWhatsAppNumber } from 'utils/handler/lead'

const RejectedImage = '/revamp/illustration/rejected-approval.webp'

export const CreditQualificationRejected = () => {
  const titleText = 'Terima kasih, Agen SEVA akan segera menghubungimu'
  const descText =
    'Maaf, datamu belum berhasil mendapatkan persetujuan secara instan. Tapi jangan khawatir, SEVA tetap akan membantu proses kredit mobil impianmu. Pastikan nomor HPmu selalu aktif ya!'
  const router = useRouter()
  const [isActive, setIsActive] = useState(false)
  const [isOpenCitySelectorModal, setIsOpenCitySelectorModal] = useState(false)
  const [cityListApi, setCityListApi] = useState<Array<CityOtrOption>>([])
  const [customerYearBorn, setCustomerYearBorn] = useState('')
  const [resultPreApproval, setResultPreApproval] =
    useState<CustomerPreApprovalResponse>()
  const [showAnnouncementBox, setShowAnnouncementBox] = useState<
    boolean | null
  >(
    getSessionStorage(
      getToken()
        ? SessionStorageKey.ShowWebAnnouncementLogin
        : SessionStorageKey.ShowWebAnnouncementNonLogin,
    ) ?? true,
  )
  const [flag, setFlag] = useState<TrackerFlag>(TrackerFlag.Init)

  const checkCitiesData = () => {
    if (cityListApi.length === 0) {
      api.getCities().then((res) => {
        setCityListApi(res)
      })
    }
  }

  const getAnnouncementBox = () => {
    api
      .getAnnouncementBox({
        headers: {
          'is-login': getToken() ? 'true' : 'false',
        },
      })
      .then((res: AxiosResponse<{ data: AnnouncementBoxDataType }>) => {
        if (res.data === undefined) {
          setShowAnnouncementBox(false)
        }
      })
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

  const redirectWhatsapp = async () => {
    trackKualifikasiKreditWaDirectClick(getDataForTracker())
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

  useEffect(() => {
    checkDataResultPreApproval()
    checkCitiesData()
    getAnnouncementBox()
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
        setShowAnnouncementBox={setShowAnnouncementBox}
        isShowAnnouncementBox={showAnnouncementBox}
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
                saveDataForCountlyTrackerPageViewHomepage(
                  PreviousButton.ButtonBackToHomepage,
                )
                router.push('/')
              }}
            />
          </div>
        </div>
      </div>
      <FooterMobile />

      <CitySelectorModal
        isOpen={isOpenCitySelectorModal}
        onClickCloseButton={() => setIsOpenCitySelectorModal(false)}
        cityListFromApi={cityListApi}
      />
    </div>
  )
}
