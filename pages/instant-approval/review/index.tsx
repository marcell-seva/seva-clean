import React, { useEffect, useState } from 'react'
import styles from 'styles/pages/instant-approval-review.module.scss'
import Progress from 'antd/lib/progress'
import { Button, Toast } from '../../../components/atoms'
import { ButtonSize, ButtonVersion } from '../../../components/atoms/button'
import { getSessionStorage } from 'utils/handler/sessionStorage'
import { MoengageEventName, setTrackEventMoEngage } from 'helpers/moengage'
import { useProtectPage } from 'utils/hooks/useProtectPage/useProtectPage'
import { useRouter } from 'next/router'
import {
  LanguageCode,
  LocalStorageKey,
  SessionStorageKey,
  TemanSeva,
} from 'utils/enum'
import { getLocalStorage } from 'utils/handler/localStorage'
import {
  CityOtrOption,
  LoanCalculatorInsuranceAndPromoType,
  NewFunnelCarVariantDetails,
  SimpleCarVariantDetail,
} from 'utils/types/utils'
import { InstallmentTypeOptions, TrackerFlag } from 'utils/types/models'
import { useFinancialQueryData } from 'services/context/finnancialQueryContext'
import { useSessionStorageWithEncryption } from 'utils/hooks/useSessionStorage/useSessionStorage'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import {
  formatNumberByLocalization,
  replacePriceSeparatorByLocalization,
} from 'utils/handler/rupiah'
import { FormLCState } from 'pages/kalkulator-kredit/[[...slug]]'
import {
  creditQualificationUrl,
  loanCalculatorDefaultUrl,
  waitingCreditQualificationUrl,
} from 'utils/helpers/routes'
import {
  CreditQualificationReviewParam,
  trackKualifikasiKreditCarDetailClick,
  trackKualifikasiKreditCarDetailClose,
  trackKualifikasiKreditReviewPageView,
} from 'helpers/amplitude/seva20Tracking'

import { isIsoDateFormat } from 'utils/handler/regex'
import { getToken } from 'utils/handler/auth'
import { Currency } from 'utils/handler/calculation'
import { useBadgePromo } from 'utils/hooks/usebadgePromo'
import { monthId } from 'utils/handler/date'
import HeaderCreditClasificationMobile from 'components/organisms/headerCreditClasificationMobile'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
import { RouteName, navigateToKK } from 'utils/navigate'
import Image from 'next/image'

import {
  getCustomerInfoSeva,
  getCustomerKtpSeva,
  saveKtp,
  saveKtpSpouse,
  updateKtpCity,
} from 'utils/handler/customer'
import { getCarVariantDetailsById } from 'utils/handler/carRecommendation'
import { getNewFunnelRecommendations } from 'utils/handler/funnel'
import dynamic from 'next/dynamic'
import { postInstantApproval } from 'services/api'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { getCity } from 'utils/hooks/useGetCity'

const Modal = dynamic(() => import('antd/lib/modal'), { ssr: false })
const PopupError = dynamic(() => import('components/organisms/popupError'), {
  ssr: false,
})
const PopupCarDetail = dynamic(
  () => import('components/organisms/popupCarDetail'),
  { ssr: false },
)
const PopupCreditDetail = dynamic(
  () => import('components/organisms/popupCreditDetail'),
  { ssr: false },
)

const CreditQualificationReviewPage = () => {
  useProtectPage()
  const router = useRouter()
  const mainKtpDomicileOptionData: any = getSessionStorage(
    SessionStorageKey.MainKtpDomicileOptionData,
  )
  const selectablePromo = getLocalStorage<LoanCalculatorInsuranceAndPromoType>(
    LocalStorageKey.SelectablePromo,
  )
  const kkFlowType = getSessionStorage(SessionStorageKey.KKIAFlowType)
  const ptbc = kkFlowType && kkFlowType === 'ptbc'
  const { BadgeList, promoList, selectedPromoList } = useBadgePromo()

  const sessionKTPUploaded = getSessionStorage(SessionStorageKey.KTPUploaded)
  const [ktpUploaded, setKtpUploaded]: any = useState(sessionKTPUploaded)
  const ktpData: any = getSessionStorage(SessionStorageKey.ReviewedKtpData)
  const mainKTP = getSessionStorage(SessionStorageKey.MainKtpType)
  const dataReview = JSON.parse(localStorage.getItem('qualification_credit')!)
  const kkForm: FormLCState | null = getSessionStorage(
    SessionStorageKey.KalkulatorKreditForm,
  )
  const optionADDM: InstallmentTypeOptions | null = getLocalStorage(
    LocalStorageKey.SelectedAngsuranType,
  )
  const [isLoading, setIsLoading] = useState(false)
  const { financialQuery } = useFinancialQueryData()
  const [dataCar, setDataCar] = useState<NewFunnelCarVariantDetails>()
  const [promoCode] = useSessionStorageWithEncryption<string>(
    SessionStorageKey.PromoCodeGiiass,
    '',
  )
  const [carDimenssion, setCarDimenssion] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [isShowDetailCar, setIsShowDetailCar] = useState(false)
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const reviewedKtpData: any = getSessionStorage(
    SessionStorageKey.ReviewedKtpData,
  )
  const [simpleCarVariantDetails] =
    useLocalStorage<SimpleCarVariantDetail | null>(
      LocalStorageKey.SimpleCarVariantDetails,
      null,
    )
  const dataQualificationCredit = JSON.parse(
    localStorage.getItem('qualification_credit')!,
  )
  const creditQualificationResultStorage: any =
    getLocalStorage(LocalStorageKey.CreditQualificationResult) ?? null
  const { fincap } = useFinancialQueryData()
  const [flag, setFlag] = useState<TrackerFlag>(TrackerFlag.Init)
  const [customerYearBorn, setCustomerYearBorn] = useState('')
  const [isOpenToast, setIsOpenToast] = useState(false)
  const [isOpenKtpError, setIsOpenKtpError] = useState(false)
  const [toastMessage, setToastMessage] = useState(
    'Mohon maaf, terjadi kendala jaringan silahkan coba kembali lagi',
  )
  const creditQualificationResultFromStorage = getLocalStorage(
    LocalStorageKey.CreditQualificationResult,
  )
  const [isUserNeverSetPersonalDomicile, setIsUserNeverSetPersonalDomicile] =
    useState(false)
  const [userNikFromDB, setUserNikFromDB] = useState('')

  const formattedIncome = (income: string) => {
    return `Rp${formatNumberByLocalization(
      Number(income),
      LanguageCode.id,
      1000000,
      10,
    )} Juta`
  }

  const checkKTPUploaded = () => {
    getCustomerKtpSeva()
      .then((result) => {
        if (result.data[0]) {
          setKtpUploaded('uploaded')
          setUserNikFromDB(result.data[0].nik)
          if (!result.data[0].city) {
            setIsUserNeverSetPersonalDomicile(true)
          }
        }
      })
      .catch((e: any) => {
        if (e?.response?.data?.code === 'NO_NIK_REGISTERED') {
          setKtpUploaded('not upload')
        }
      })
  }

  const onClickCtaNext = async () => {
    trackEventCountly(
      CountlyEventNames.WEB_INSTANT_APPROVAL_PAGE_CONFIRMATION_CONTINUE_CLICK,
    )
    try {
      setIsLoading(true)

      const lead: any = getLocalStorage(
        LocalStorageKey.CreditQualificationResult,
      )
      const tempLeadId = lead.leadId
      const dataKTPSpouse = getSessionStorage(
        SessionStorageKey.DataUploadKTPSpouse,
      ) as any
      if (ktpUploaded === 'not upload') {
        const dataKTP = getSessionStorage(
          SessionStorageKey.DataUploadKTP,
        ) as any

        delete dataKTP.created
        if (dataKTPSpouse) delete dataKTPSpouse.created
        await saveKtp({
          ...dataKTP,
          isSpouse: dataKTPSpouse ? true : false,
          ...(dataKTPSpouse && { spouseKtpObj: { ...dataKTPSpouse } }),
        })
        sessionStorage.removeItem(SessionStorageKey.DataUploadKTP)
        sessionStorage.removeItem(SessionStorageKey.DataUploadKTPSpouse)
      } else {
        if (dataKTPSpouse) {
          delete dataKTPSpouse.created
          await saveKtpSpouse({ ...dataKTPSpouse })
          sessionStorage.removeItem(SessionStorageKey.DataUploadKTPSpouse)
        }
        if (isUserNeverSetPersonalDomicile) {
          await updateKtpCity({
            nik: userNikFromDB,
            city: mainKtpDomicileOptionData?.lastChoosenDomicile,
          })
        }
      }

      const dataBodyIA = {
        leadId: tempLeadId,
        useKtpSpouseAsMain: mainKTP === 'spouse' ? true : false,
        leasing: kkForm?.leasingOption?.toUpperCase() || '',
        cityDom: mainKtpDomicileOptionData.lastChoosenDomicile,
        leadName: mainKTP === 'spouse' ? ktpData[1].name : ktpData[0].name,
      }
      const res = await postInstantApproval(dataBodyIA, {
        headers: { Authorization: getToken()?.idToken },
      })
      if (res) {
        sessionStorage.removeItem(SessionStorageKey.KTPUploaded)
        localStorage.removeItem(LocalStorageKey.SelectablePromo)
        localStorage.removeItem(LocalStorageKey.CreditQualificationLeadPayload)
        sessionStorage.setItem(
          SessionStorageKey.TempCreditQualificationResult,
          JSON.stringify(creditQualificationResultStorage),
        )
        localStorage.removeItem(LocalStorageKey.CreditQualificationResult)
        router.push(waitingCreditQualificationUrl)
      }
    } catch (error: any) {
      if (error?.response?.data?.code === 'KTP_SAME_DATA') {
        setIsOpenKtpError(true)
      } else if (error?.response?.data?.message) {
        setToastMessage(`${error?.response?.data?.message}`)
        setIsOpenToast(true)
      } else {
        setToastMessage(
          'Mohon maaf, terjadi kendala jaringan silahkan coba kembali lagi',
        )
        setIsOpenToast(true)
      }
      setIsLoading(false)
    }
  }

  const fetchNewFunnelRecommendation = async () => {
    const response = await getNewFunnelRecommendations({})
    const choosenModel = response.carRecommendations.find(
      (car: any) => car.id === dataCar?.modelDetail.id,
    )

    if (choosenModel) {
      setCarDimenssion(
        `${choosenModel.length} x ${choosenModel.width} x ${choosenModel.height} mm`,
      )
    }
  }

  const getFormattedDate = (dateData: string | Date) => {
    const date = new Date(dateData)
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()

    return `${day} ${monthId(month)} ${year}`
  }

  const trackIAReviewDetailClick = () => {
    const track = {
      CAR_BRAND: dataCar?.modelDetail.brand ?? '',
      CAR_MODEL: dataCar?.modelDetail.model ?? '',
      CAR_VARIANT: dataCar?.variantDetail.name ?? '',
      PAGE_ORIGINATION: RouteName.KKReview,
      PAGE_ORIGINATION_URL: window.location.href,
    }

    trackEventCountly(
      CountlyEventNames.WEB_CREDIT_QUALIFICATION_FORM_PAGE_CAR_DETAIL_CLICK,
      track,
    )
  }

  const handleOpenDetail = () => {
    setIsShowDetailCar(true)
    trackIAReviewDetailClick()
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
    getCustomerInfoSeva()
      .then((response) => {
        if (!!response[0].dob && isIsoDateFormat(response[0].dob)) {
          setCustomerYearBorn(response[0].dob.slice(0, 4))
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const sendDataTracker = () => {
    let peluangKreditBadge = 'Null'
    const oocupation = dataQualificationCredit.occupations?.replace('&', 'and')
    const pageReferrer =
      sessionStorage.getItem(SessionStorageKey.PageReferrerIA) || ''
    const badge =
      simpleCarVariantDetails.loanRank === 'Red'
        ? 'Sulit disetujui'
        : 'Mudah disetujui'

    if (fincap) {
      peluangKreditBadge = badge
      if (pageReferrer === 'Multi Unit Kualifikasi Kredit Result')
        peluangKreditBadge = 'Null'
    } else {
      peluangKreditBadge = 'Null'
    }

    const financingCompany =
      kkForm?.leasingOption === ''
        ? 'No preference'
        : kkForm?.leasingOption?.toUpperCase()
    const data = {
      PAGE_REFERRER: pageReferrer,
      PELUANG_KREDIT_BADGE: peluangKreditBadge,
      CAR_BRAND: dataCar?.modelDetail.brand ?? '',
      CAR_MODEL: dataCar?.modelDetail.model ?? '',
      CAR_VARIANT: dataCar?.variantDetail?.name ?? '',
      OCCUPATION: oocupation,
      FINANCING_COMPANY: financingCompany,
      KUALIFIKASI_KREDIT_RESULT:
        creditQualificationResultStorage.creditQualificationStatus +
        ' disetujui',
    }

    if (ptbc) {
      trackEventCountly(
        CountlyEventNames.WEB_PTBC_INSTANT_APPROVAL_PAGE_CONFIRMATION_VIEW,
      )
    } else {
      trackEventCountly(
        CountlyEventNames.WEB_INSTANT_APPROVAL_PAGE_CONFIRMATION_VIEW,
        data,
      )
    }
  }
  useEffect(() => {
    if (!!getToken()) {
      if (
        !simpleCarVariantDetails ||
        !dataReview ||
        !mainKtpDomicileOptionData ||
        !ktpData ||
        !reviewedKtpData ||
        !creditQualificationResultFromStorage
      ) {
        router.replace(loanCalculatorDefaultUrl)
      } else if (simpleCarVariantDetails && !dataReview) {
        // no need to change sessionStorage "KKIAFlowType" because user will be in the same flow type
        navigateToKK()
      } else if (simpleCarVariantDetails) {
        getCarVariantDetailsById(
          simpleCarVariantDetails.variantId, // get cheapest variant
        ).then((response) => {
          if (response) {
            setDataCar(response)
          }
        })

        getCurrentUserInfo()
      }
      checkKTPUploaded()
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
      sendDataTracker()
    }
  }, [dataCar, customerYearBorn])

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
        <div className={styles.titleText}>
          Kualifikasi Kredit: Instant Approval
        </div>
        <div className={styles.subTitleText}>Konfirmasi Data</div>
        <div className={styles.descTitle}>
          Periksa kembali informasi kamu sebelum mengecek Kualifikasi Kredit.
        </div>
        <div className={styles.paddingFormJob}>
          <div className={styles.rowWithSpaceBottom}>
            <div className={styles.column}>
              <p className={styles.openSansLigtGrey}>Nomor KTP Kamu</p>
              <p className={styles.openSansSemiblack}>
                {Array.isArray(reviewedKtpData) && reviewedKtpData[0].nik}
              </p>
            </div>
            {Array.isArray(reviewedKtpData) && reviewedKtpData.length > 1 && (
              <div className={styles.column}>
                <p className={styles.openSansLigtGrey}>Nomor KTP Pasanganmu</p>
                <p className={styles.openSansSemiblack}>
                  {Array.isArray(reviewedKtpData) && reviewedKtpData[1].nik}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className={styles.paddingFormJob}>
          <div className={styles.rowWithSpaceBottom}>
            <div className={styles.column}>
              <p className={styles.openSansLigtGrey}>Tanggal Lahirmu</p>
              <p className={styles.openSansSemiblack}>
                {Array.isArray(reviewedKtpData) &&
                  getFormattedDate(reviewedKtpData[0].birthdate)}
              </p>
            </div>
            {Array.isArray(reviewedKtpData) && reviewedKtpData.length > 1 && (
              <div className={styles.column}>
                <p className={styles.openSansLigtGrey}>
                  Tanggal Lahir Pasanganmu
                </p>
                <p className={styles.openSansSemiblack}>
                  {' '}
                  {Array.isArray(reviewedKtpData) &&
                    getFormattedDate(reviewedKtpData[1].birthdate)}
                </p>
              </div>
            )}
          </div>
        </div>
        {ptbc ||
          (dataReview?.temanSevaTrxCode && (
            <div className={styles.paddingFormIncome}>
              <p className={styles.titleTextForm}>Kode Referral Teman SEVA</p>
              <p className={styles.textIncome}>
                {ptbc ? TemanSeva.PTBC : dataReview?.temanSevaTrxCode}
              </p>
            </div>
          ))}
        <div
          className={styles.imageCar}
          style={{ paddingBottom: promoCode ? 15.56 : 31.56 }}
        >
          <img
            src={dataCar?.variantDetail?.images[0]}
            alt="car-images"
            width={188}
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
                {selectablePromo && selectablePromo.tdpAfterPromo > 0
                  ? replacePriceSeparatorByLocalization(
                      Number(selectablePromo.tdpAfterPromo),
                      LanguageCode.id,
                    )
                  : replacePriceSeparatorByLocalization(
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
              {dataReview && dataReview?.multiKK && (
                <p className={styles.priceStrike}>
                  Rp
                  {Currency(dataReview?.totalFirstPaymentOriginal)}
                </p>
              )}
            </div>
            <div className={styles.column}>
              <p className={styles.openSansLigtGrey}>Cicilan Bulanan</p>
              <p className={styles.openSansSemiblack}>
                Rp
                {selectablePromo &&
                typeof selectablePromo.installmentAfterPromo !== 'undefined' &&
                selectablePromo.installmentAfterPromo > 0
                  ? replacePriceSeparatorByLocalization(
                      Number(selectablePromo.installmentAfterPromo),
                      LanguageCode.id,
                    )
                  : replacePriceSeparatorByLocalization(
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
              {dataReview && dataReview?.multiKK && (
                <p className={styles.priceStrike}>
                  Rp
                  {Currency(dataReview?.loanMonthlyInstallmentOriginal)}
                </p>
              )}
            </div>
          </div>
          {(promoCode ||
            (selectedPromoList && selectedPromoList.length > 0) ||
            dataReview?.multiKK) && (
            <div className={styles.promoWrapper}>
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
                {dataReview?.multiKK && (
                  <div className={styles.textPromoBold}>
                    • {dataReview?.selectablePromo[0].title}
                  </div>
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
            <div className={styles.columnFull}>
              <p className={styles.openSansLigtGrey}>Perusahaan Pembiayaan</p>
              <p className={styles.openSansSemiblack}>
                {kkForm?.leasingOption === ''
                  ? 'Tidak Ada Preferensi'
                  : kkForm?.leasingOption?.toUpperCase()}
              </p>
            </div>
          </div>

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
            loading={isLoading}
            disabled={isLoading}
          >
            Ajukan Instant Approval
          </Button>
        </div>
      </div>
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

      <Modal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        title=""
        footer={null}
        className="custom-modal-credit"
        width={343}
        style={{ borderRadius: '8px' }}
      >
        <PopupCreditDetail
          carVariant={dataCar}
          dataFinancial={financialQuery}
          city={cityOtr ? cityOtr?.cityName : 'Jakarta Pusat'}
          promoCode={promoCode}
          simpleCarVariantDetails={simpleCarVariantDetails}
          optionADDM={optionADDM}
        />
      </Modal>

      <Toast
        width={339}
        open={isOpenToast}
        text={toastMessage}
        typeToast={'error'}
        onCancel={() => setIsOpenToast(false)}
        closeOnToastClick
      />

      <PopupError
        open={isOpenKtpError}
        onCancel={() => {
          setIsOpenKtpError(false)
        }}
        onCancelText={() => {
          setIsOpenKtpError(false)
        }}
        cancelText="Tutup"
        title="KTP Sudah Terdaftar"
        subTitle={'Kamu tidak dapat menggunakan KTP yang sama.'}
        width={346}
      />
    </>
  )
}

export default CreditQualificationReviewPage
