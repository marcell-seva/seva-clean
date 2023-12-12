import React, { useEffect, useState } from 'react'
import styles from 'styles/pages/kualifikasi-kredit-review.module.scss'
import Progress from 'antd/lib/progress'
import { Button } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { useProtectPage } from 'utils/hooks/useProtectPage/useProtectPage'
import { useRouter } from 'next/router'
import { getLocalStorage, saveLocalStorage } from 'utils/handler/localStorage'
import {
  CityOtrOption,
  LoanCalculatorInsuranceAndPromoType,
  NewFunnelCarVariantDetails,
  SendKualifikasiKreditRequest,
  SimpleCarVariantDetail,
} from 'utils/types/utils'
import {
  LanguageCode,
  LocalStorageKey,
  SessionStorageKey,
  TemanSeva,
} from 'utils/enum'
import {
  getSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'
import { InstallmentTypeOptions, TrackerFlag } from 'utils/types/models'
import { useFinancialQueryData } from 'services/context/finnancialQueryContext'
import { useSessionStorageWithEncryption } from 'utils/hooks/useSessionStorage/useSessionStorage'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import {
  formatNumberByLocalization,
  replacePriceSeparatorByLocalization,
} from 'utils/handler/rupiah'
import { getCity } from 'utils/hooks/useCurrentCityOtr/useCurrentCityOtr'
import {
  CreditQualificationReviewParam,
  trackKualifikasiKreditCarDetailClick,
  trackKualifikasiKreditCarDetailClose,
  trackKualifikasiKreditReviewPageCtaClick,
  trackKualifikasiKreditReviewPageView,
} from 'helpers/amplitude/seva20Tracking'
import { MoengageEventName, setTrackEventMoEngage } from 'helpers/moengage'
import { getToken } from 'utils/handler/auth'
import {
  creditQualificationUrl,
  loanCalculatorDefaultUrl,
} from 'utils/helpers/routes'
import HeaderCreditClasificationMobile from 'components/organisms/headerCreditClasificationMobile'
import { getOptionLabel } from 'utils/handler/optionLabel'
import { occupations } from 'utils/occupations'
import { Currency } from 'utils/handler/calculation'
import { useBadgePromo } from 'utils/hooks/usebadgePromo'
import { FormLCState } from 'pages/kalkulator-kredit/[[...slug]]'
import { isIsoDateFormat } from 'utils/handler/regex'
import Seo from 'components/atoms/seo'
import { client, defaultSeoImage } from 'utils/helpers/const'
import { RouteName, navigateToKK } from 'utils/navigate'
import Image from 'next/image'
import { getCustomerInfoSeva } from 'utils/handler/customer'
import { getCarVariantDetailsById } from 'utils/handler/carRecommendation'
import { getNewFunnelRecommendations } from 'utils/handler/funnel'
import dynamic from 'next/dynamic'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import { useCar } from 'services/context/carContext'
import { postCreditQualification } from 'services/api'
import { useAfterInteractive } from 'utils/hooks/useAfterInteractive'

const PopupCarDetail = dynamic(
  () => import('components/organisms/popupCarDetail'),
)

const LandingIA = dynamic(() =>
  import('components/organisms/landingIA').then((mod) => mod.LandingIA),
)

const Toast = dynamic(() => import('components/atoms').then((mod) => mod.Toast))

const CreditQualificationReviewPage = () => {
  useProtectPage()
  const router = useRouter()
  const dataReview =
    client && JSON.parse(localStorage.getItem('qualification_credit')!)
  const selectablePromo = getLocalStorage<LoanCalculatorInsuranceAndPromoType>(
    LocalStorageKey.SelectablePromo,
  )
  const kkFlowType = getSessionStorage(SessionStorageKey.KKIAFlowType)
  const ptbc = kkFlowType && kkFlowType === 'ptbc'
  const ptbcLeadId = getSessionStorage(SessionStorageKey.PtbcLeadId)
  const { selectedPromoList, BadgeList, promoList } = useBadgePromo()
  const { recommendation, saveRecommendation } = useCar()
  const kkForm: FormLCState | null = getLocalStorage(
    LocalStorageKey.KalkulatorKreditForm,
  )
  const optionADDM: InstallmentTypeOptions | null = getLocalStorage(
    LocalStorageKey.SelectedAngsuranType,
  )
  const { financialQuery, fincap } = useFinancialQueryData()
  const { filterFincap } = useFunnelQueryData()
  const [dataCar, setDataCar] = useState<NewFunnelCarVariantDetails>()
  const [promoCode] = useSessionStorageWithEncryption<string>(
    SessionStorageKey.PromoCodeGiiass,
    '',
  )
  const [carDimenssion, setCarDimenssion] = useState('')
  const [isShowDetailCar, setIsShowDetailCar] = useState(false)
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const [simpleCarVariantDetails] =
    useLocalStorage<SimpleCarVariantDetail | null>(
      LocalStorageKey.SimpleCarVariantDetails,
      null,
    )
  const [flag, setFlag] = useState<TrackerFlag>(TrackerFlag.Init)
  const [customerYearBorn, setCustomerYearBorn] = useState('')
  const [openIA, setOpenIA] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpenToast, setIsOpenToast] = useState(false)
  const [toastMessage, setToastMessage] = useState(
    'Mohon maaf, terjadi kendala jaringan silahkan coba kembali lagi',
  )

  const formattedIncome = (income: string) => {
    return `Rp${formatNumberByLocalization(
      Number(income),
      LanguageCode.id,
      1000000,
      10,
    )} Juta`
  }

  const datatoCaasDaas: SendKualifikasiKreditRequest = {
    cityId: Number(getCity().id),
    variantId: dataCar?.variantDetail.id || '',
    modelId: dataCar?.modelDetail.id || '',
    priceOtr: Number(dataCar?.variantDetail.priceValue),
    monthlyIncome: Number(dataReview?.monthlyIncome),
    loanDownPayment: Number(dataReview?.loanDownPayment),
    totalFirstPayment: Number(dataReview?.totalFirstPayment),
    angsuranType: optionADDM || InstallmentTypeOptions.ADDM,
    promoCode: dataReview?.promoCode,
    loanTenure: Number(dataReview?.loanTenure),
    rateType: dataReview?.rateType,
    ageRange: kkForm?.age || '',
    flatRate: Number(dataReview?.flatRate),
    loanMonthlyInstallment: Number(dataReview?.loanMonthlyInstallment),
    occupation: dataReview?.occupations,
    insuranceType: selectablePromo?.selectedInsurance.value || 'FC',
    temanSevaTrxCode: ptbc ? TemanSeva.PTBC : dataReview?.temanSevaTrxCode,
    loanRank: dataReview?.loanRank,
    platform: 'web',
    dob: dataReview?.dob ?? null,
    ...(selectablePromo?.dpDiscount && {
      loanDownPaymentDiscount: selectablePromo.dpDiscount,
    }),
    ...(!!ptbcLeadId && !!ptbc && { leadId: String(ptbcLeadId) }),
    ...(selectablePromo &&
      typeof selectablePromo.installmentAfterPromo !== 'undefined' &&
      selectablePromo.installmentAfterPromo > 0 && {
        loanMonthlyInstallmentOriginal: selectablePromo?.installmentBeforePromo,
      }),
    ...(selectablePromo &&
      typeof selectablePromo.interestRateAfterPromo !== 'undefined' &&
      selectablePromo.interestRateAfterPromo > 0 && {
        flatRateOriginal: selectablePromo.interestRateBeforePromo,
      }),
    ...(selectablePromo &&
      selectablePromo.tdpAfterPromo > 0 && {
        loanDownPaymentOriginal: selectablePromo.tdpBeforePromo,
        totalFirstPaymentOriginal: selectablePromo.tdpBeforePromo,
      }),
    ...(selectedPromoList && selectedPromoList.length > 0
      ? {
          selectablePromo: selectedPromoList.map((x) => x.promoId),
        }
      : { selectablePromo: [] }),
  }

  const onClickCtaNext = async () => {
    try {
      setIsLoading(true)
      const sendKK = await postCreditQualification(datatoCaasDaas, {
        headers: { Authorization: getToken()?.idToken },
      })
      saveLocalStorage(
        LocalStorageKey.CreditQualificationResult,
        JSON.stringify(sendKK.data),
      )
      saveLocalStorage(
        LocalStorageKey.CreditQualificationLeadPayload,
        JSON.stringify(datatoCaasDaas),
      )
      setOpenIA(true)
      setIsLoading(false)
    } catch (e: any) {
      setIsLoading(false)

      if (e?.response?.data?.message) {
        setToastMessage(`${e?.response?.data?.message}`)
      } else {
        setToastMessage(
          'Mohon maaf, terjadi kendala jaringan silahkan coba kembali lagi',
        )
      }
      setIsOpenToast(true)
    }
    saveSessionStorage(
      SessionStorageKey.PageReferrerIA,
      'Kualifikasi Kredit Review',
    )
  }

  const fetchNewFunnelRecommendation = async () => {
    const response = await getNewFunnelRecommendations({
      age: String(financialQuery.age),
      tenure: Number(financialQuery.tenure),
      monthlyIncome: String(financialQuery.monthlyIncome),
    })
    if (response) saveRecommendation(response.carRecommendations)
    const choosenModel = response.carRecommendations.find(
      (car: any) => car.id === dataCar?.modelDetail.id,
    )

    if (choosenModel) {
      setCarDimenssion(
        `${choosenModel.length} x ${choosenModel.width} x ${choosenModel.height} mm`,
      )
    }
  }

  const dataTrackCar = () => ({
    CAR_BRAND: dataCar?.modelDetail.brand || 'Null',
    CAR_VARIANT: dataCar?.variantDetail.name || 'Null',
    CAR_MODEL: dataCar?.modelDetail.model || 'Null',
  })

  const dataTrackLandingIA = () => {
    const infoCarRecommendation = recommendation.filter(
      (x) => x.id === dataCar?.modelDetail.id,
    )[0]
    return {
      ...dataTrackCar(),
      PAGE_REFERRER: RouteName.KKReview,
      TENOR_OPTION: simpleCarVariantDetails?.loanTenure + ' tahun',
      TENOR_RESULT:
        simpleCarVariantDetails?.loanRank === 'Green'
          ? 'Mudah disetujui'
          : simpleCarVariantDetails?.loanRank === 'Red'
          ? 'Sulit disetujui'
          : 'Null',
      INCOME_CHANGE:
        Number(financialQuery.monthlyIncome) ===
        Number(dataReview?.monthlyIncome)
          ? 'No'
          : 'Yes',
      INSURANCE_TYPE: selectablePromo?.selectedInsurance.label || 'Null',
      PROMO_AMOUNT: selectedPromoList
        ? String(selectedPromoList.length)
        : 'Null',
      TEMAN_SEVA_STATUS: dataReview?.temanSevaTrxCode ? 'Yes' : 'No',
      PELUANG_KREDIT_BADGE: fincap
        ? infoCarRecommendation
          ? infoCarRecommendation.loanRank === 'Green'
            ? 'Mudah disetujui'
            : 'Sulit disetujui'
          : 'Null'
        : 'Null',
      FINCAP_FILTER_USAGE: filterFincap ? 'Yes' : 'No',
    }
  }

  const trackCreditQualificationReviewDetailClick = () => {
    const track = {
      ...dataTrackCar(),
      PAGE_ORIGINATION: RouteName.KKReview,
      PAGE_ORIGINATION_URL: window.location.href,
    }

    trackEventCountly(
      CountlyEventNames.WEB_CREDIT_QUALIFICATION_FORM_PAGE_CAR_DETAIL_CLICK,
      track,
    )
  }

  const trackCreditQualificationReview = ({ ctaClick = false }) => {
    const track = {
      ...dataTrackCar(),
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
    }

    if (ctaClick)
      return trackEventCountly(
        CountlyEventNames.WEB_CREDIT_QUALIFICATION_PAGE_REVIEW_CTA_CLICK,
        track,
      )

    if (ptbc) {
      return trackEventCountly(
        CountlyEventNames.WEB_PTBC_CREDIT_QUALIFICATION_REVIEW_PAGE_VIEW,
      )
    } else {
      return trackEventCountly(
        CountlyEventNames.WEB_CREDIT_QUALIFICATION_REVIEW_PAGE_VIEW,
        track,
      )
    }
  }

  const handleOpenDetail = () => {
    setIsShowDetailCar(true)
    trackCreditQualificationReviewDetailClick()
  }
  const handleCloseDetail = () => {
    setIsShowDetailCar(false)
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
    }
  }

  const trackAmplitudeAndMoengagePageView = () => {
    trackKualifikasiKreditReviewPageView({
      ...getDataForTracker(),
      Income: formattedIncome(String(financialQuery.monthlyIncome)),
    })
    setTrackEventMoEngage(
      MoengageEventName.view_kualifikasi_kredit_review_page,
      {
        ...getDataForTracker(),
        Income: formattedIncome(String(financialQuery.monthlyIncome)),
      },
    )
  }

  const getCurrentUserInfo = () => {
    getCustomerInfoSeva().then((response) => {
      // setLoadShimmer2(false)
      if (!!response[0].dob && isIsoDateFormat(response[0].dob)) {
        setCustomerYearBorn(response[0].dob.slice(0, 4))
      }
    })
  }

  useEffect(() => {
    if (!!getToken()) {
      if (!simpleCarVariantDetails && !dataReview) {
        router.push(loanCalculatorDefaultUrl)
      } else if (
        !simpleCarVariantDetails ||
        !simpleCarVariantDetails?.variantId ||
        !optionADDM
      ) {
        router.push(loanCalculatorDefaultUrl)
      } else if (simpleCarVariantDetails && !dataReview) {
        // no need to change sessionStorage "KKIAFlowType" because user will be in the same flow type
        navigateToKK()
      } else if (simpleCarVariantDetails) {
        getCarVariantDetailsById(
          simpleCarVariantDetails?.variantId, // get cheapest variant
        )
          .then((response) => {
            if (response) {
              setDataCar(response)
            } else {
              router.push(loanCalculatorDefaultUrl)
            }
          })
          .catch(() => {
            router.push(loanCalculatorDefaultUrl)
          })

        getCurrentUserInfo()
      }
    }
  }, [])

  useEffect(() => {
    if (!!getToken()) {
      fetchNewFunnelRecommendation()
    }
  }, [dataCar?.modelDetail.id])

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

  useAfterInteractive(() => {
    if (dataCar) trackCreditQualificationReview({ ctaClick: false })
  }, [dataCar])

  const cityName = getCity()?.cityName || 'Jakarta Pusat'

  return (
    <>
      <Seo
        title="SEVA - Beli Mobil Terbaru Dengan Cicilan Kredit Terbaik"
        description="Beli mobil terbaru dari Toyota, Daihatsu, BMW dengan Instant Approval*. Proses Aman & Mudah✅ Terintegrasi dengan ACC & TAF✅ SEVA member of ASTRA"
        image={defaultSeoImage}
      />
      <HeaderCreditClasificationMobile />
      <div className={styles.progressBar}>
        <Progress
          className={styles.antProgress}
          percent={90}
          showInfo={false}
          size="small"
          strokeColor={{ '0%': '#51A8DB', '100%': '#51A8DB' }}
          trailColor="#EBECEE"
        />
      </div>
      <div className={styles.container}>
        <div className={styles.titleText}>Kualifikasi Kredit</div>
        <div className={styles.subTitleText}>Konfirmasi Datamu</div>
        <div className={styles.descTitle}>
          Periksa kembali informasi kamu sebelum mengecek Kualifikasi Kredit.
        </div>
        <div className={styles.paddingFormJob}>
          <p className={styles.titleTextTwoForm}>Pekerjaan</p>
          <p className={styles.textForm}>
            {getOptionLabel(occupations.options, dataReview?.occupations)}
          </p>
        </div>
        <div className={styles.paddingFormIncome}>
          <p className={styles.titleTextForm}>Pendapatan Bulananmu</p>
          <p className={styles.textIncome}>
            Rp
            {replacePriceSeparatorByLocalization(
              Number(dataReview?.monthlyIncome),
              LanguageCode.id,
            )}
          </p>
        </div>
        {(ptbc || dataReview?.temanSevaTrxCode) && (
          <div className={styles.paddingFormIncome}>
            <p className={styles.titleTextForm}>Kode Referral Teman SEVA</p>
            <p className={styles.textIncome}>
              {ptbc ? TemanSeva.PTBC : dataReview?.temanSevaTrxCode}
            </p>
          </div>
        )}
        <div
          className={styles.imageCar}
          style={{ paddingBottom: promoCode ? 15.56 : 31.56 }}
        >
          <Image
            src={dataCar?.variantDetail?.images[0] || ''}
            alt="car-images"
            width={188.39}
            height={141.28}
            style={{ height: 'auto' }}
          />
        </div>
        <div className={styles.wrapperWithBorderBottom}>
          <div className={styles.titleSelectCar}>Mobil yang kamu pilih:</div>
          <div className={styles.titleTextCar}>
            {dataCar?.modelDetail.brand} {dataCar?.modelDetail.model}
          </div>
          <div className={styles.textType}>{dataCar?.variantDetail.name}</div>
          <div className={styles.textPrice}>
            Rp
            {replacePriceSeparatorByLocalization(
              Number(dataCar?.variantDetail.priceValue),
              LanguageCode.id,
            )}
          </div>
          <div className={styles.textCity}>
            <span className={styles.margin}>Harga OTR {cityName} </span>
          </div>
          <div className={styles.rowWithSpaceBottom}>
            <div className={styles.column}>
              <p className={styles.openSansLigtGrey}>Tenor</p>
              <p className={styles.openSansSemiblack}>
                {simpleCarVariantDetails?.loanTenure}
              </p>
            </div>
            <div className={styles.column}>
              <p className={styles.openSansLigtGrey}>Bunga</p>
              <p className={styles.openSansSemiblack}>
                {simpleCarVariantDetails?.flatRate}%
              </p>
            </div>
          </div>
          <div className={styles.rowWithSpaceBottom}>
            <div className={styles.column}>
              <p className={styles.openSansLigtGrey}>Pembayaran Pertama</p>
              <p className={styles.openSansSemiblack}>
                Rp
                {replacePriceSeparatorByLocalization(
                  Number(dataReview?.totalFirstPayment),
                  LanguageCode.id,
                )}
              </p>
              {selectablePromo && selectablePromo.tdpAfterPromo > 0 && (
                <p className={styles.priceStrike}>
                  Rp
                  {Currency(selectablePromo.tdpBeforePromo)}
                </p>
              )}
            </div>
            <div className={styles.column}>
              <p className={styles.openSansLigtGrey}>Cicilan Bulanan</p>
              <p className={styles.openSansSemiblack}>
                Rp
                {replacePriceSeparatorByLocalization(
                  Number(dataReview?.loanMonthlyInstallment),
                  LanguageCode.id,
                )}
              </p>
              {selectablePromo &&
                typeof selectablePromo.installmentAfterPromo !== 'undefined' &&
                selectablePromo.installmentAfterPromo > 0 && (
                  <p className={styles.priceStrike}>
                    Rp
                    {Currency(selectablePromo.installmentBeforePromo)}
                  </p>
                )}
            </div>
          </div>
          {(promoCode ||
            (selectedPromoList && selectedPromoList.length > 0)) && (
            <div className={styles.promoBorder}>
              <div className={styles.textPromo}>Promo yang kamu pilih:</div>
              <div className={styles.textPromoWrapper}>
                {promoList &&
                  promoList.map((item, index) => (
                    <div key={index} className={styles.textPromoBold}>
                      • {item.promoTitle}
                    </div>
                  ))}
                {promoCode && (
                  <div className={styles.textPromoBold}>• {promoCode}</div>
                )}
                <div className={styles.badgePromoWrapper}>
                  <BadgeList />
                </div>
              </div>
            </div>
          )}
          <div className={styles.rowWithSpaceBottom}>
            <div className={styles.columnFull}>
              <p className={styles.openSansLigtGrey}>
                Pembayaran Cicilan Pertama
              </p>
              <p className={styles.openSansSemiblack}>
                {optionADDM === 'ADDM' ? 'Bayar di Depan' : 'Bayar di Belakang'}
              </p>
            </div>
          </div>
          {selectablePromo && (
            <div className={styles.rowWithSpaceBottom}>
              <div className={styles.columnFull}>
                <p className={styles.openSansLigtGrey}>Tipe Asuransi</p>
                <p className={styles.openSansSemiblack}>
                  {selectablePromo.selectedInsurance.label}
                </p>
              </div>
            </div>
          )}

          <div className={styles.rowWithSpaceBottom}>
            <p className={styles.textDetail} onClick={handleOpenDetail}>
              Lihat Detail Mobil
            </p>
          </div>
        </div>
        <div className={styles.paddingButton}>
          <Button
            version={ButtonVersion.PrimaryDarkBlue}
            size={ButtonSize.Big}
            onClick={onClickCtaNext}
            disabled={isLoading}
            loading={isLoading}
          >
            Cek Kualifikasi Kredit
          </Button>
        </div>
      </div>
      <LandingIA
        open={openIA}
        onClose={() => setOpenIA(false)}
        dataToCaasDaas={datatoCaasDaas}
        isSendLeadsOnClickButton={false}
        dataTrack={dataTrackLandingIA}
      />
      <PopupCarDetail
        isOpen={isShowDetailCar}
        dpBeforeDiscount={
          selectablePromo?.tdpAfterPromo
            ? String(selectablePromo?.tdpBeforePromo)
            : ''
        }
        dp={dataReview?.totalFirstPayment}
        installmentFee={dataReview?.loanMonthlyInstallment}
        installmentFeeBeforeDiscount={
          selectablePromo?.installmentAfterPromo
            ? String(selectablePromo?.installmentBeforePromo)
            : ''
        }
        price={dataCar?.variantDetail.priceValue || 0}
        tenure={dataReview?.loanTenure}
        onCancel={handleCloseDetail}
        carSeats={dataCar?.variantDetail.carSeats}
        engineCapacity={dataCar?.variantDetail.engineCapacity}
        fuelType={dataCar?.variantDetail.fuelType}
        transmission={dataCar?.variantDetail.transmission}
        rasioBahanBakar={dataCar?.variantDetail.rasioBahanBakar}
        dimenssion={carDimenssion}
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

export default CreditQualificationReviewPage
