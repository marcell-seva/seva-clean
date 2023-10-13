import React, { useEffect, useState } from 'react'
import styles from 'styles/pages/kualifikasi-kredit-review.module.scss'
import { Modal, Progress, Tooltip } from 'antd'
import { Button, IconInfo } from '../../../components/atoms'
import { ButtonSize, ButtonVersion } from '../../../components/atoms/button'
import { useProtectPage } from 'utils/hooks/useProtectPage/useProtectPage'
import { useRouter } from 'next/router'
import { getLocalStorage } from 'utils/handler/localStorage'
import {
  CityOtrOption,
  LoanCalculatorInsuranceAndPromoType,
  NewFunnelCarVariantDetails,
  SendKualifikasiKreditRequest,
  SimpleCarVariantDetail,
} from 'utils/types/utils'
import { LanguageCode, LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { getSessionStorage } from 'utils/handler/sessionStorage'
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
import TooltipDaihatsu from 'components/molecules/tooltipDaihatsu'
import { Currency } from 'utils/handler/calculation'
import PopupCarDetail from 'components/organisms/popupCarDetail'
import PopupCreditDetail from 'components/organisms/popupCreditDetail'
import { LandingIA } from 'components/organisms/landingIA'
import { useBadgePromo } from 'utils/hooks/usebadgePromo'
import { FormLCState } from 'pages/kalkulator-kredit/[[...slug]]'
import { isIsoDateFormat } from 'utils/handler/regex'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
import { navigateToKK } from 'utils/navigate'
import Image from 'next/image'
import { getCustomerInfoSeva } from 'utils/handler/customer'
import { getCarVariantDetailsById } from 'utils/handler/carRecommendation'
import { getNewFunnelRecommendations } from 'utils/handler/funnel'

const CreditQualificationReviewPage = () => {
  useProtectPage()
  const router = useRouter()
  const dataReview: any = getLocalStorage(LocalStorageKey.QualifcationCredit)

  const selectablePromo = getLocalStorage<LoanCalculatorInsuranceAndPromoType>(
    LocalStorageKey.SelectablePromo,
  )
  const { selectedPromoList, BadgeList, promoList } = useBadgePromo()

  const kkForm: FormLCState | null = getSessionStorage(
    SessionStorageKey.KalkulatorKreditForm,
  )
  const optionADDM: InstallmentTypeOptions | null = getLocalStorage(
    LocalStorageKey.SelectedAngsuranType,
  )
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)
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
  const [simpleCarVariantDetails] =
    useLocalStorage<SimpleCarVariantDetail | null>(
      LocalStorageKey.SimpleCarVariantDetails,
      null,
    )
  const [flag, setFlag] = useState<TrackerFlag>(TrackerFlag.Init)
  const [customerYearBorn, setCustomerYearBorn] = useState('')
  const [openIA, setOpenIA] = useState(false)

  const totalIncome = Number(dataReview?.monthlyIncome) || 0

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
    temanSevaTrxCode: dataReview?.temanSevaTrxCode,
    loanRank: dataReview?.loanRank,
    platform: 'web',
    ...(selectablePromo &&
      typeof selectablePromo.installmentAfterPromo !== 'undefined' &&
      selectablePromo.installmentAfterPromo > 0 && {
        loanMonthlyInstallmentVanilla: selectablePromo?.installmentBeforePromo,
      }),
    ...(selectablePromo &&
      typeof selectablePromo.interestRateAfterPromo !== 'undefined' &&
      selectablePromo.interestRateAfterPromo > 0 && {
        flatRateVanilla: selectablePromo.interestRateBeforePromo,
      }),
    ...(selectablePromo &&
      selectablePromo.tdpAfterPromo > 0 && {
        loanDownPaymentVanilla: selectablePromo.tdpBeforePromo,
        totalFirstPaymentVanilla: selectablePromo.tdpBeforePromo,
      }),
    ...(selectedPromoList && selectedPromoList.length > 0
      ? {
          selectablePromo: selectedPromoList.map((x) => x.promoId),
        }
      : { selectablePromo: [] }),
  }

  const onClickCtaNext = async () => {
    //after success response
    trackKualifikasiKreditReviewPageCtaClick({
      ...getDataForTracker(),
      Total_Income: formattedIncome(String(totalIncome)),
    })

    setOpenIA(true)
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

  const getCreditCualficationDataTracker = () => ({
    ...getDataForTracker(),
    Income: undefined,
    Total_Income: `Rp${formatNumberByLocalization(
      Number(dataReview?.monthlyIncome),
      LanguageCode.id,
      1000000,
      10,
    )} Juta`,
    Page_Origination: window.location.href,
  })

  const handleOpenDetail = () => {
    trackKualifikasiKreditCarDetailClick(getCreditCualficationDataTracker())
    setIsShowDetailCar(true)
  }
  const handleCloseDetail = () => {
    trackKualifikasiKreditCarDetailClose(getCreditCualficationDataTracker())
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
    if (!!getToken()) {
      if (!simpleCarVariantDetails && !dataReview) {
        router.push(loanCalculatorDefaultUrl)
        return
      }
      if (!simpleCarVariantDetails || !simpleCarVariantDetails?.variantId) {
        router.push(loanCalculatorDefaultUrl)
        return
      }
      if (simpleCarVariantDetails && !dataReview) {
        navigateToKK()
        return
      }
      if (simpleCarVariantDetails) {
        getCarVariantDetailsById(
          simpleCarVariantDetails.variantId, // get cheapest variant
        )
          .then((response) => {
            if (response) {
              setDataCar(response)
            } else {
              router.push(loanCalculatorDefaultUrl)
              return
            }
          })
          .catch(() => {
            router.push(loanCalculatorDefaultUrl)
            return
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
        {/*{dataReview?.spouseIncome !== null && (*/}
        {/*  <div className={styles.paddingFormIncome}>*/}
        {/*    <p className={styles.titleTextForm}>*/}
        {/*      Pendapatan Bulanan Pasanganmu*/}
        {/*    </p>*/}
        {/*    <p className={styles.textIncome}>*/}
        {/*      Rp*/}
        {/*      {replacePriceSeparatorByLocalization(*/}
        {/*        Number(dataReview?.spouseIncome),*/}
        {/*        LanguageCode.id,*/}
        {/*      )}*/}
        {/*    </p>*/}
        {/*  </div>*/}
        {/*)}*/}
        {dataReview?.temanSevaTrxCode && (
          <div className={styles.paddingFormIncome}>
            <p className={styles.titleTextForm}>Kode Referral Teman SEVA</p>
            <p className={styles.textIncome}>{dataReview?.temanSevaTrxCode}</p>
          </div>
        )}
        <div
          className={styles.imageCar}
          style={{ paddingBottom: promoCode ? 15.56 : 31.56 }}
        >
          <Image
            src={dataCar?.variantDetail?.images[0] || ''}
            alt="car-images"
            width="188.39"
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
            <span className={styles.margin}>
              Harga OTR {cityOtr ? cityOtr?.cityName : 'Jakarta Pusat'}{' '}
            </span>
            <div
              className={`${styles.overlay} ${
                isTooltipOpen ? styles.showOverlay : ''
              }`}
              onClick={() => setIsTooltipOpen(false)}
            />
            {dataCar?.modelDetail.brand.includes('Daihatsu') && (
              <Tooltip
                title={<TooltipDaihatsu />}
                color="#246ED4"
                placement="top"
                trigger="click"
                // visible={isTooltipOpen}
              >
                <IconInfo
                  // onClick={() => setIsTooltipOpen(true)}
                  className={styles.margin}
                  width={18}
                  height={18}
                  color="#878D98"
                />
              </Tooltip>
            )}
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
          >
            Cek Kualifikasi Kredit
          </Button>
        </div>
      </div>
      <LandingIA
        open={openIA}
        onClose={() => setOpenIA(false)}
        dataToCaasDaas={datatoCaasDaas}
      />
      <PopupCarDetail
        isOpen={isShowDetailCar}
        dp={dataReview?.totalFirstPayment}
        installmentFee={dataReview?.loanMonthlyInstallment}
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
    </>
  )
}

export default CreditQualificationReviewPage
