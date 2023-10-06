/* eslint-disable react/no-children-prop */
import React, { useEffect, useState } from 'react'
// import { useHistory } from 'react-router-dom'

import { getSessionStorage } from 'utils/handler/sessionStorage'
import styles from 'styles/components/organisms/success.module.scss'
import urls from 'helpers/urls'
import clsx from 'clsx'
import {
  CreditQualificationReviewParam,
  trackKualifikasiKreditDownloadAndroidClick,
  trackKualifikasiKreditDownloadIosClick,
  trackKualifikasiKreditSuccessResultPageView,
  trackKualifikasiKreditWaDirectClick,
} from 'helpers/amplitude/seva20Tracking'
import { MoengageEventName, setTrackEventMoEngage } from 'helpers/moengage'
import dayjs from 'dayjs'
import endpoints from 'helpers/endpoints'
import { AxiosResponse } from 'axios'
import { CityOtrOption } from 'utils/types'
import {
  AnnouncementBoxDataType,
  CustomerPreApprovalResponse,
} from 'utils/types/utils'
import { LanguageCode, LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { getLocalStorage } from 'utils/handler/localStorage'
import { million, ten } from 'utils/helpers/const'
import { isIsoDateFormat } from 'utils/handler/regex'
import { HeaderMobile } from 'components/organisms'
import { BannerCard } from 'components/molecules/card/bannerCard'
import { Gap, IconCSA, IconDownload } from 'components/atoms'
import { CitySelectorModal, FooterMobile } from 'components/molecules'
import { api } from 'services/api'
import { getToken } from 'utils/handler/auth'
import { formatNumberByLocalization } from 'utils/handler/rupiah'
import { TrackerFlag } from 'utils/types/models'
import Image from 'next/image'
import { getCustomerAssistantWhatsAppNumber } from 'utils/handler/lead'
import { getCustomerInfoSeva } from 'utils/handler/customer'

const ApprovalImageAcc = '/revamp/illustration/approve-acc.webp'
const ApprovalImageTaf = '/revamp/illustration/approve-taf.webp'
const LogoGooglePlay = '/revamp/icon/google-play.webp'
const LogoAppStore = '/revamp/icon/app-store.webp'

export const CreditQualificationSuccess = () => {
  const titleText = 'Instant Approval Kamu Disetujui'
  const preApprovalResultData: any = getLocalStorage(
    LocalStorageKey.PreApprovalResult,
  )
  const dateText = preApprovalResultData?.fincoResultAt

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
  const [cityListApi, setCityListApi] = useState<Array<CityOtrOption>>([])
  const [resultPreApproval, setResultPreApproval]: any =
    useState<CustomerPreApprovalResponse>()
  // const history = useHistory()
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
  const [customerYearBorn, setCustomerYearBorn] = useState('')

  const checkCitiesData = (): void => {
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

  const checkDataResultPreApproval = () => {
    const response: CustomerPreApprovalResponse | null = getLocalStorage(
      LocalStorageKey.resultPreApproval,
    )
    if (response !== null) setResultPreApproval(response)
    // else history.push('/kalkulator-kredit')
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

  const onClickPlayStore = () => {
    trackKualifikasiKreditDownloadAndroidClick(getDataForTracker())
  }

  const onClickAppStore = () => {
    trackKualifikasiKreditDownloadIosClick(getDataForTracker())
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

  useEffect(() => {
    // checkDataResultPreApproval()
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
        <div className={styles.resultSuccess}>
          <div className={styles.bundleImage}>
            <Image
              src={
                preApprovalResultData?.finco.toLowerCase() === 'acc'
                  ? ApprovalImageAcc
                  : ApprovalImageTaf
              }
              alt="approval-image"
              className={styles.approvalImage}
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
