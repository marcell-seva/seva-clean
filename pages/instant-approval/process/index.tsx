import React, { useEffect, useMemo, useState } from 'react'
import styles from 'styles/pages/kk-waiting-result.module.scss'

import { fetchCustomerDetails } from 'utils/httpUtils/customerUtils'

import urls from 'helpers/urls'

import {
  CreditQualificationReviewParam,
  trackKualifikasiKreditCariMobilClick,
  trackKualifikasiKreditDownloadAndroidClick,
  trackKualifikasiKreditDownloadIosClick,
  trackKualifikasiKreditWaitingResultPageView,
} from 'helpers/amplitude/seva20Tracking'
import { MoengageEventName, setTrackEventMoEngage } from 'helpers/moengage'
import { useProtectPage } from 'utils/hooks/useProtectPage/useProtectPage'
import { useRouter } from 'next/router'
import { useFinancialQueryData } from 'services/context/finnancialQueryContext'
import { NewFunnelCarVariantDetails } from 'utils/types'
import {
  CityOtrOption,
  CustomerInfoSeva,
  SimpleCarVariantDetail,
} from 'utils/types/utils'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { useSessionStorageWithEncryption } from 'utils/hooks/useSessionStorage/useSessionStorage'
import { LanguageCode, LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { TrackerFlag } from 'utils/types/models'
import { isIsoDateFormat } from 'utils/handler/regex'
import { carResultsUrl } from 'utils/helpers/routes'
import { formatNumberByLocalization } from 'utils/handler/rupiah'
import { getToken } from 'utils/handler/auth'
import { FooterMobile, HeaderMobile } from 'components/organisms'
import { Button } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { CitySelectorModal } from 'components/molecules'
import { getLocalStorage } from 'utils/handler/localStorage'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
import { PreviousButton, navigateToPLP } from 'utils/navigate'
import Image from 'next/image'
import { api } from 'services/api'
import { getCustomerInfoSeva } from 'utils/handler/customer'
import { getCarVariantDetailsById } from 'utils/handler/carRecommendation'

const KualifikasiKreditImage = '/revamp/illustration/kualifikasi-kredit.webp'
const PlayStoreImage = '/revamp/images/profile/google-play.webp'
const AppStoreImage = '/revamp/images/profile/app-store.webp'

const CreditQualificationProcess = () => {
  useProtectPage()
  const router = useRouter()
  const { financialQuery } = useFinancialQueryData()
  const dataReview: any =
    getLocalStorage(LocalStorageKey.QualifcationCredit) || []
  const [dataCar, setDataCar] = useState<NewFunnelCarVariantDetails>()
  const [customerYearBorn, setCustomerYearBorn] = useState('')
  const { monthlyIncome, tenure, downPaymentAmount, age } = financialQuery
  const [openCitySelectorModal, setOpenCitySelectorModal] = useState(false)
  const [customerDetail, setCustomerDetail] = useState<CustomerInfoSeva>()
  const [showSidebar, setShowSidebar] = useState(false)
  const [cityListApi, setCityListApi] = useState<Array<CityOtrOption>>([])
  const [simpleCarVariantDetails] =
    useLocalStorage<SimpleCarVariantDetail | null>(
      LocalStorageKey.SimpleCarVariantDetails,
      null,
    )
  const [promoCode] = useSessionStorageWithEncryption<string>(
    SessionStorageKey.PromoCodeGiiass,
    '',
  )
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const [flag, setFlag] = useState<TrackerFlag>(TrackerFlag.Init)

  const checkCitiesData = () => {
    if (cityListApi.length === 0) {
      api.getCities().then((res) => {
        setCityListApi(res)
      })
    }
  }

  const getCustomerInfoData = async () => {
    try {
      const response = await fetchCustomerDetails()
      const customerDetails: CustomerInfoSeva = response[0]
      setCustomerDetail(customerDetails)
      if (!!customerDetails.dob && isIsoDateFormat(customerDetails.dob)) {
        setCustomerYearBorn(customerDetails.dob.slice(0, 4))
      }
    } catch (error) {
      throw error
    }
  }

  const gotoPLP = () => {
    trackKualifikasiKreditCariMobilClick(getDataForTracker())
    const urlParam = new URLSearchParams({
      ...(age && { age: String(age) }),
      ...(monthlyIncome && { monthlyIncome: String(monthlyIncome) }),
      ...(downPaymentAmount && {
        downPaymentAmount: String(downPaymentAmount),
      }),
      ...(tenure && { tenure: String(tenure) }),
    }).toString()
    navigateToPLP(PreviousButton.IAWaitingForResult, { search: urlParam })
  }

  // const gotoRp = () => {
  //   // trackKualifikasiKreditCariMobilClick(getDataForTracker())
  //   router.push('/riwayat-pengajuan')
  // }

  const formattedPhonenNumber = (phoneNumber: string) => {
    const replaceCountryCode = phoneNumber.replace('+62', '0') || ''
    const phoneNumberLength = replaceCountryCode.length
    let newFormat = ''
    for (let i = 0; i < phoneNumberLength; i++) {
      if (i < 3 || i > phoneNumberLength - 4) newFormat += replaceCountryCode[i]
      else newFormat += '*'
    }

    return newFormat
  }

  const totalIncome = dataReview.spouseIncome
    ? Number(dataReview.spouseIncome) + Number(financialQuery.monthlyIncome)
    : Number(financialQuery.monthlyIncome)

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
      Car_Brand: dataCar?.modelDetail?.brand ?? '',
      Car_Model: dataCar?.modelDetail?.model ?? '',
      Car_Variant: dataCar?.variantDetail?.name ?? '',
      DP: `Rp${formatNumberByLocalization(
        simpleCarVariantDetails?.loanDownPayment ?? 0,
        LanguageCode.id,
        1000000,
        10,
      )} Juta`,
      Total_Income: formattedIncome(String(totalIncome)),
      Monthly_Installment: `Rp${formatNumberByLocalization(
        simpleCarVariantDetails?.loanMonthlyInstallment ?? 0,
        LanguageCode.id,
        1000000,
        10,
      )} jt/bln`,
      Tenure: `${simpleCarVariantDetails?.loanTenure ?? 0} Tahun`,
      Promo: !!promoCode ? promoCode : null,
      Year_Born: customerYearBorn,
      City: cityOtr?.cityName || 'Jakarta Pusat',
      Teman_SEVA_Ref_Code: !!dataReview?.temanSevaTrxCode
        ? dataReview?.temanSevaTrxCode
        : null,
      Occupation: dataReview?.occupation ?? '',
      Page_Origination: 'https://' + window.location.host + location.pathname,
    }
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

  const getCarDetail = () => {
    if (!!getToken()) {
      if (simpleCarVariantDetails) {
        getCarVariantDetailsById(
          simpleCarVariantDetails.variantId, // get cheapest variant
        ).then((response) => {
          if (response) {
            setDataCar(response.data)
          }
        })

        getCurrentUserInfo()
      }
    }
  }

  const cencoredPhoneNumber = useMemo(() => {
    if (customerDetail) {
      return formattedPhonenNumber(customerDetail.phoneNumber)
    }
    return ''
  }, [customerDetail?.phoneNumber])

  const trackAmplitudeAndMoengagePageView = () => {
    trackKualifikasiKreditWaitingResultPageView({
      ...getDataForTracker(),
      Total_Income: undefined,
      Page_Origination: undefined,
      Income: formattedIncome(String(financialQuery?.monthlyIncome ?? 0)),
    })
    setTrackEventMoEngage(
      MoengageEventName.view_kualifikasi_kredit_waiting_result_page,
      {
        ...getDataForTracker(),
        Total_Income: undefined,
        Page_Origination: undefined,
        Income: formattedIncome(String(financialQuery?.monthlyIncome ?? 0)),
      },
    )
  }

  const getDataCar = () => {
    getCarVariantDetailsById(
      simpleCarVariantDetails.variantId, // get cheapest variant
    ).then((response) => {
      if (response) {
        setDataCar(response.data)
      }
    })
  }

  const onClickPlayStore = () => {
    trackKualifikasiKreditDownloadAndroidClick(getDataForTracker())
    window.open(urls.googlePlayHref, '_blank')
  }

  const onClickAppStore = () => {
    trackKualifikasiKreditDownloadIosClick(getDataForTracker())
    window.open(urls.appStoreHerf, '_blank')
  }

  useEffect(() => {
    if (!!getToken()) {
      getCustomerInfoData()
    }

    if (!!simpleCarVariantDetails) {
      getDataCar()
    }

    checkCitiesData()
    getCarDetail()
  }, [])

  useEffect(() => {
    if (
      !!dataCar &&
      !!simpleCarVariantDetails &&
      !!customerYearBorn &&
      !!dataReview &&
      flag === TrackerFlag.Init
    ) {
      trackAmplitudeAndMoengagePageView()
      setFlag(TrackerFlag.Sent)
    }
  }, [dataCar, customerYearBorn])

  return (
    <>
      <Seo
        title="SEVA - Beli Mobil Terbaru Dengan Cicilan Kredit Terbaik"
        description="Beli mobil terbaru dari Toyota, Daihatsu, BMW dengan Instant Approval*. Proses Aman & Mudah✅ Terintegrasi dengan ACC & TAF✅ SEVA member of ASTRA"
        image={defaultSeoImage}
      />
      <div className={styles.headerWrapper}>
        <HeaderMobile
          isActive={showSidebar}
          setIsActive={setShowSidebar}
          emitClickCityIcon={() => null}
        />
      </div>
      <div className={styles.container}>
        <Image
          src={KualifikasiKreditImage}
          alt="Instant Approval"
          className={styles.heroImage}
          width={183}
          height={137}
        />
        <div className={styles.informationWrapper}>
          <h3>
            Terima Kasih, aplikasi Instant Approval kamu sedang dalam proses!
          </h3>
          <span>
            Proses akan berlangsung selama beberapa menit. Lihat hasil di
            halaman Riwayat Pengajuan atau
            <span className={styles.semibold}>
              {` melalui WhatsApp ke ${cencoredPhoneNumber}.`}
            </span>
          </span>
        </div>
        <div className={styles.buttonWrapper}>
          <Button
            version={ButtonVersion.Secondary}
            size={ButtonSize.Big}
            secondaryClassName={styles.cariMobil}
            onClick={gotoPLP}
          >
            Cari Mobil Lain
          </Button>
          {/*<Button*/}
          {/*  version={ButtonVersion.PrimaryDarkBlue}*/}
          {/*  size={ButtonSize.Big}*/}
          {/*  secondaryClassName={styles.cariMobil}*/}
          {/*  onClick={gotoRp}*/}
          {/*>*/}
          {/*  Riwayat Pengajuan*/}
          {/*</Button>*/}
        </div>
        {/*<CardShadow*/}
        {/*  className={styles.ctaWrapper}*/}
        {/*  onClick={() => {*/}
        {/*    trackKualifikasiKreditUploadKTP(getDataForTracker())*/}
        {/*    router.push(landingKtpUrl)*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <div className={styles.main}>*/}
        {/*    <img*/}
        {/*      src={PromoBanner}*/}
        {/*      alt="promo banner"*/}
        {/*      width={107}*/}
        {/*      height={81}*/}
        {/*      className={styles.promoBanner}*/}
        {/*    />*/}
        {/*    <div className={styles.infoWrapper}>*/}
        {/*      <span className={styles.title}>*/}
        {/*        {customerDetail?.nik*/}
        {/*          ? 'Kamu memenuhi syarat untuk promo'*/}
        {/*          : 'Dapatkan Cashback Cicilan Hingga Rp4 juta!'}*/}
        {/*      </span>*/}
        {/*      <span className={styles.sub}>*/}
        {/*        {customerDetail?.nik*/}
        {/*          ? ' Dapatkan Cashback Cicilan Hingga 4 juta!'*/}
        {/*          : ' Kirim foto KTP kamu dan dapatkan promo sekarang.'}*/}
        {/*      </span>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*  <IconChevronRight height={24} width={24} />*/}
        {/*</CardShadow>*/}
        <div className={styles.directAppsContainer}>
          <div className={styles.title}>Download Aplikasi SEVA</div>
          <div className={styles.directAppsWrapper}>
            <Image
              src={PlayStoreImage}
              alt="Playstore Seva"
              onClick={onClickPlayStore}
            />
            <Image
              src={AppStoreImage}
              alt="App Store Seva"
              onClick={onClickAppStore}
            />
          </div>
        </div>
      </div>
      <FooterMobile />
      <CitySelectorModal
        isOpen={openCitySelectorModal}
        onClickCloseButton={() => setOpenCitySelectorModal(false)}
        cityListFromApi={cityListApi}
      />
    </>
  )
}

export default CreditQualificationProcess
