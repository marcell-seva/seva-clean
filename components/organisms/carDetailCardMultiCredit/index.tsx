import React, { useEffect, useRef, useState } from 'react'
import styles from 'styles/components/organisms/cardetailcardMultiCredit.module.scss'
import elementId from 'helpers/elementIds'
import Tooltip from 'antd/lib/tooltip'
import { LandingIA } from '../landingIA'
import {
  dpRateCollectionNewCalculatorTmp,
  FormLCState,
  MultKKCarRecommendation,
  PromoItemType,
  SendKualifikasiKreditRequest,
  SimpleCarVariantDetail,
  trackDataCarType,
} from 'utils/types/utils'
import { useMultiUnitQueryContext } from 'services/context/multiUnitQueryContext'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { LanguageCode, LocalStorageKey, SessionStorageKey } from 'utils/enum'
import {
  formatNumberByLocalization,
  replacePriceSeparatorByLocalization,
} from 'utils/handler/rupiah'
import {
  dpRateCollectionNewCalculator,
  hundred,
  million,
} from 'utils/helpers/const'
import { getCity } from 'utils/hooks/useGetCity'
import { InstallmentTypeOptions } from 'utils/types/models'
import { getOptionValue } from 'utils/handler/optionLabel'
import { occupations } from 'utils/occupations'
import { Button, CardShadow, Overlay } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import TooltipContentMultiKK from 'components/molecules/tooltipMultiKKContent'
import { LabelMudah, LabelPromo, LabelSulit } from 'components/molecules'
import LabelSedang from 'components/molecules/labelCard/sedang'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import dynamic from 'next/dynamic'
import clsx from 'clsx'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import { saveLocalStorage } from 'utils/handler/localStorage'
import {
  getSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'
import { RouteName } from 'utils/navigate'
import { postLoanPermutationIncludePromo } from 'services/api'
import Image from 'next/image'

const Toast = dynamic(
  () => import('components/atoms/toast').then((mod) => mod.Toast),
  { ssr: false },
)

type CarDetailCardProps = {
  order: number
  recommendation: MultKKCarRecommendation
  trxCode: string
  onClickLabelPromo: (promoData: PromoItemType | null) => void
  onClickSeeDetail: (value: MultKKCarRecommendation) => void
  showToolTip: boolean
  setShowTooltipDisclaimer: (value: boolean) => void
  showToolTipDisclaimer: boolean
  selectedCityName: string
  selectedDp: string
  selectedTenure: string
}

const discountedCarPrice = undefined // for current promo, it will not affect OTR
const discountedDp = undefined // for current promo, it will not affect DP

const CarDetailCardMultiCredit = ({
  order = 0,
  recommendation,
  trxCode,
  onClickLabelPromo,
  onClickSeeDetail,
  showToolTip,
  setShowTooltipDisclaimer,
  showToolTipDisclaimer,
  selectedCityName,
  selectedDp,
  selectedTenure,
}: CarDetailCardProps) => {
  const { multiUnitQuery } = useMultiUnitQueryContext()
  const [, setSimpleCarVariantDetails] =
    useLocalStorage<SimpleCarVariantDetail | null>(
      LocalStorageKey.SimpleCarVariantDetails,
      null,
    )
  const { filterFincap } = useFunnelQueryData()
  const [datatoCaasDaas, setDatatoCaasDaas] =
    useState<SendKualifikasiKreditRequest | null>()
  const [loadSubmit, setLoadSubmit] = useState(false)
  const [openLandingIA, setOpenLandingIA] = useState(false)
  const [isOpenToast, setIsOpenToast] = useState(false)
  const [toastMessage, setToastMessage] = useState(
    'Mohon maaf, terjadi kendala jaringan silahkan coba kembali lagi',
  )
  const dataCar: trackDataCarType | null = getSessionStorage(
    SessionStorageKey.PreviousCarDataBeforeLogin,
  )

  const regularCarPrice = replacePriceSeparatorByLocalization(
    recommendation.variants[0].priceValue,
    LanguageCode.id,
  )

  const regularInstallment = formatNumberByLocalization(
    recommendation.variants[0].monthlyInstallment,
    LanguageCode.id,
    million,
    hundred,
  )

  const discountedInstallment = formatNumberByLocalization(
    recommendation.variants[0].monthlyInstallmentSpekta ?? 0,
    LanguageCode.id,
    million,
    hundred,
  )

  const regularDp = formatNumberByLocalization(
    parseInt(selectedDp), // use DP from form page
    LanguageCode.id,
    million,
    hundred,
  )

  const getDpPercentageByMapping = (dpValue: number) => {
    const dpOtr = dpRateCollectionNewCalculator.map(
      (dp: dpRateCollectionNewCalculatorTmp) => {
        return {
          ...dp,
          dpCalc: dp.dpCalc * recommendation.lowestAssetPrice,
        }
      },
    )

    if (dpValue >= recommendation.lowestAssetPrice * 0.5) {
      return 50
    } else {
      for (let i = 0; i < 8; i++) {
        if (dpValue >= dpOtr[i].dpCalc && dpValue < dpOtr[i + 1].dpCalc) {
          return dpOtr[i].dpRate
        }
      }
    }

    return 20 //default
  }

  const cityName = selectedCityName || 'Jakarta Pusat'

  const kkForm = (): FormLCState => ({
    city: getCity(),
    model: {
      modelId: recommendation.id,
      modelName: recommendation.model,
      modelImage: recommendation.images[0],
      brandName: recommendation.brand,
      loanRank: '',
    },
    variant: {
      variantId: recommendation.variants[0].id,
      variantName: recommendation.variants[0].name,
      otr: String(recommendation.variants[0].priceValue),
      discount: 0,
    },
    promoCode: '',
    isValidPromoCode: false,
    age: '',
    monthlyIncome: multiUnitQuery.monthlyIncome,
    downPaymentAmount: multiUnitQuery.downPaymentAmount,
    paymentOption: InstallmentTypeOptions.ADDM,
  })
  const resetValueForTrackWaDirect = () => {
    const dataCarTemp = {
      ...dataCar,
      INCOME_CHANGE: 'No',
      INCOME_KK: 'Null',
    }
    saveSessionStorage(
      SessionStorageKey.PreviousCarDataBeforeLogin,
      JSON.stringify(dataCarTemp),
    )
  }
  const navigateToInstantApproval = () => {
    setLoadSubmit(true)
    resetValueForTrackWaDirect()
    postLoanPermutationIncludePromo({
      brand: recommendation.brand,
      model: recommendation.model,
      angsuranType: 'ADDM',
      city: getCity().cityCode,
      discount: 0,
      dp: getDpPercentageByMapping(Number(multiUnitQuery.downPaymentAmount)),
      dpAmount: Number(multiUnitQuery.downPaymentAmount),
      monthlyIncome: multiUnitQuery.monthlyIncome,
      otr: recommendation.variants[0].priceValue,
    })
      .then((response) => {
        const resultByTenure = response.data.data.filter(
          (x: { tenure: string }) => String(x.tenure) === multiUnitQuery.tenure,
        )
        const toyotaSpekta = recommendation.promo?.promoId === 'TS01'
        const installment = toyotaSpekta
          ? recommendation.variants[0].monthlyInstallmentSpekta
          : recommendation.variants[0].monthlyInstallment
        const flatRate = toyotaSpekta
          ? recommendation.variants[0].interestSpekta ||
            resultByTenure[0].interestRateSpekta
          : resultByTenure[0].interestRate
        const tpp = toyotaSpekta
          ? resultByTenure[0].totalFirstPaymentSpekta
          : resultByTenure[0].totalFirstPayment
        const rateType = toyotaSpekta ? 'TOYOTASPEKTA01' : 'REGULAR'
        const dataToCaasDaasTemp: SendKualifikasiKreditRequest = {
          leadId: multiUnitQuery.multikkResponse.leadId,
          cityId: Number(getCity().id),
          variantId: recommendation.variants[0].id || '',
          modelId: recommendation.id || '',
          priceOtr: Number(recommendation.variants[0].priceValue),
          monthlyIncome: Number(multiUnitQuery.monthlyIncome),
          loanDownPayment: Number(multiUnitQuery.downPaymentAmount),
          totalFirstPayment: Number(tpp),
          angsuranType: InstallmentTypeOptions.ADDM,
          promoCode: '',
          loanTenure: Number(multiUnitQuery.tenure),
          rateType,
          flatRate,
          loanMonthlyInstallment: Number(installment),
          occupation: getOptionValue(
            occupations.options,
            multiUnitQuery.occupation,
          ) as string,
          insuranceType: 'FC',
          temanSevaTrxCode: trxCode,
          loanRank: recommendation.loanRank,
          platform: 'web',
          ...(toyotaSpekta
            ? { selectablePromo: [String(recommendation.promo?.promoId)] }
            : { selectablePromo: [] }),
          ...(toyotaSpekta && {
            loanMonthlyInstallmentOriginal:
              recommendation.variants[0].monthlyInstallment,
          }),
        }
        saveLocalStorage(
          LocalStorageKey.SelectedAngsuranType,
          InstallmentTypeOptions.ADDM,
        )
        setDatatoCaasDaas(dataToCaasDaasTemp)
        setSimpleCarVariantDetails({
          modelId: dataToCaasDaasTemp.modelId,
          variantId: dataToCaasDaasTemp.variantId,
          loanTenure: dataToCaasDaasTemp.loanTenure,
          loanDownPayment: dataToCaasDaasTemp.loanDownPayment,
          loanMonthlyInstallment: dataToCaasDaasTemp.loanMonthlyInstallment,
          loanRank: dataToCaasDaasTemp.loanRank,
          totalFirstPayment: dataToCaasDaasTemp.totalFirstPayment,
          flatRate: dataToCaasDaasTemp.flatRate,
        })
        saveSessionStorage(
          SessionStorageKey.KalkulatorKreditForm,
          JSON.stringify(kkForm()),
        )
        localStorage.setItem(
          'qualification_credit',
          JSON.stringify({
            modelId: dataToCaasDaasTemp?.modelId,
            variantId: dataToCaasDaasTemp?.variantId,
            loanTenure: dataToCaasDaasTemp?.loanTenure,
            loanDownPayment: dataToCaasDaasTemp.loanDownPayment,
            loanMonthlyInstallment: dataToCaasDaasTemp.loanMonthlyInstallment,
            loanRank: dataToCaasDaasTemp.loanRank,
            totalFirstPayment: dataToCaasDaasTemp.totalFirstPayment,
            flatRate: dataToCaasDaasTemp.flatRate,
            monthlyIncome: dataToCaasDaasTemp.monthlyIncome,
            address: {
              province: '',
              city: '',
              zipCode: '',
            },
            email: null,
            citySelector: getCity()?.cityName ?? 'Jakarta Pusat',
            spouseIncome: dataToCaasDaasTemp.monthlyIncome,
            promoCode: dataToCaasDaasTemp.promoCode || '',
            temanSevaTrxCode: dataToCaasDaasTemp.temanSevaTrxCode || '',
            angsuranType: dataToCaasDaasTemp.angsuranType,
            rateType: dataToCaasDaasTemp.rateType,
            platform: 'web',
            occupations: dataToCaasDaasTemp.occupation,
            ...(toyotaSpekta && { multiKK: true }),
            ...(toyotaSpekta && {
              selectablePromo: [
                {
                  id: recommendation.promo?.promoId,
                  title: recommendation.promo?.promoTitle,
                },
              ],
            }),
            ...(toyotaSpekta && {
              loanMonthlyInstallmentOriginal:
                recommendation.variants[0].monthlyInstallment,
            }),
            ...(toyotaSpekta && {
              totalFirstPaymentOriginal: resultByTenure[0].totalFirstPayment,
            }),
            fromMultiKK: true,
          }),
        )
        const track = {
          CAR_BRAND: recommendation.brand,
          CAR_MODEL: recommendation.model,
          CAR_ORDER: order + 1,
          KUALIFIKASI_KREDIT_RESULT: recommendation.creditQualificationStatus,
          PROMO_AMOUNT: toyotaSpekta ? '1' : '0',
        }

        trackEventCountly(
          CountlyEventNames.WEB_MULTI_KK_PAGE_RESULT_IA_CLICK,
          track,
        )
      })
      .catch((error: any) => {
        if (error?.response?.data?.message) {
          setToastMessage(`${error?.response?.data?.message}`)
        } else {
          setToastMessage(
            'Mohon maaf, terjadi kendala jaringan silahkan coba kembali lagi',
          )
        }
        setIsOpenToast(true)
      })
      .catch((error: any) => {
        if (error?.response?.data?.message) {
          setToastMessage(`${error?.response?.data?.message}`)
        } else {
          setToastMessage(
            'Mohon maaf, terjadi kendala jaringan silahkan coba kembali lagi',
          )
        }
        setIsOpenToast(true)
      })
      .finally(() => {
        saveSessionStorage(
          SessionStorageKey.PageReferrerIA,
          'Multi Unit Kualifikasi Kredit Result',
        )
        setLoadSubmit(false)
        setOpenLandingIA(true)
      })
  }

  const handleUnderstandTooltip = () => {
    setShowTooltipDisclaimer(false)
    trackEventCountly(
      CountlyEventNames.WEB_MULTI_KK_PAGE_RESULT_COACHMARK_CLICK,
    )
  }

  const handleCloseTooltip = () => {
    setShowTooltipDisclaimer(false)
  }

  const handleTooltipClose = () => {
    setShowTooltipDisclaimer(false)
  }

  const goToButton = useRef<null | HTMLDivElement>(null)
  const scrollToSection = () => {
    goToButton.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'end',
    })
  }

  const dataTrackLandingIA = () => {
    const dataCarTemp = {
      ...dataCar,
      IA_FLOW: 'Instant Approval (Multi)',
    }
    saveSessionStorage(
      SessionStorageKey.PreviousCarDataBeforeLogin,
      JSON.stringify(dataCarTemp),
    )
    const toyotaSpekta = recommendation.promo?.promoId === 'TS01'
    return {
      CAR_BRAND: recommendation.brand || 'Null',
      CAR_VARIANT: recommendation.variants[0].name || 'Null',
      CAR_MODEL: recommendation.model || 'Null',
      PAGE_REFERRER: RouteName.MultiUnitResult,
      TENOR_OPTION: selectedTenure + ' tahun',
      TENOR_RESULT: 'Null',
      INCOME_CHANGE: 'No',
      INSURANCE_TYPE: 'Full comprehensive',
      PROMO_AMOUNT: toyotaSpekta ? '1' : '0',
      TEMAN_SEVA_STATUS: datatoCaasDaas?.temanSevaTrxCode ? 'Yes' : 'No',
      FINCAP_FILTER_USAGE: filterFincap ? 'Yes' : 'No',
      PELUANG_KREDIT_BADGE: 'Null',
    }
  }

  useEffect(() => {
    if (showToolTipDisclaimer) {
      scrollToSection()
    }
  }, [showToolTipDisclaimer])

  const renderCtaAndDisclaimer = () => {
    return (
      <>
        <div className={styles.ctaGroup}>
          {!showToolTipDisclaimer && (
            <Button
              version={ButtonVersion.Secondary}
              size={ButtonSize.Big}
              onClick={navigateToInstantApproval}
              loading={loadSubmit}
              disabled={loadSubmit}
              // data-testid={elementId.PLP.Button.HitungKemampuan}
            >
              Lanjut Instant Approval
            </Button>
          )}

          {showToolTipDisclaimer && showToolTip && (
            <>
              <Overlay
                isShow={showToolTipDisclaimer}
                onClick={handleCloseTooltip}
                zIndex={998}
              />
              <div style={{ width: '100%' }}>
                <Tooltip
                  title={
                    <TooltipContentMultiKK onClick={handleUnderstandTooltip} />
                  }
                  color="#246ED4"
                  placement="top"
                  className="multi-kk"
                  visible={showToolTipDisclaimer}
                  overlayClassName="multi-kk"
                >
                  <div className={showToolTipDisclaimer ? styles.bordered : ''}>
                    <Button
                      version={ButtonVersion.Secondary}
                      size={ButtonSize.Big}
                      onClick={handleTooltipClose}
                      style={{
                        background: showToolTipDisclaimer ? 'white' : '',
                      }}
                    >
                      Lanjut Instant Approval
                    </Button>
                  </div>
                </Tooltip>
              </div>
            </>
          )}
        </div>
      </>
    )
  }
  return (
    <>
      <div className={styles.container} ref={showToolTip ? goToButton : null}>
        <CardShadow className={styles.cardWrapper}>
          <Image
            src={recommendation.images[0]}
            className={styles.heroImg}
            alt={`${recommendation.brand} ${recommendation.model}`}
            data-testid={elementId.CarImage}
            width={279}
            height={209}
          />
          <LabelPromo
            className={styles.labelCard}
            onClick={() => onClickLabelPromo(recommendation.promo)}
            regulerText={recommendation.promo ? '1 ' : 'Tersedia '}
            boldText={recommendation.promo ? 'promo diterapkan' : 'promo'}
            data-testid={elementId.PLP.Button.Promo}
          />
          {recommendation.creditQualificationStatus.toLowerCase() ===
            'sedang' && (
            <LabelSedang
              additionalClassname={
                recommendation.promo
                  ? styles.loanRankLabelAdditionalStyle
                  : styles.loanRankLabelAdditionalStyle2
              }
              prefixComponent={() => <></>}
            />
          )}
          {recommendation.creditQualificationStatus.toLowerCase() ===
            'mudah' && (
            <LabelMudah
              additionalClassname={
                recommendation.promo
                  ? styles.loanRankLabelAdditionalStyle
                  : styles.loanRankLabelAdditionalStyle2
              }
              labelText="Kualifikasi Kredit Mudah"
              prefixComponent={() => <></>}
            />
          )}
          {recommendation.creditQualificationStatus.toLowerCase() ===
            'sulit' && (
            <LabelSulit
              additionalClassname={clsx({
                [styles.labelSulit]: true,
                [styles.loanRankLabelAdditionalStyle]: recommendation.promo,
                [styles.loanRankLabelAdditionalStyle2]: !recommendation.promo,
              })}
              labelText="Kualifikasi Kredit Sulit"
              prefixComponent={() => <></>}
            />
          )}
          <div className={styles.contentWrapper}>
            <h3
              className={styles.brandModelText}
              data-testid={elementId.PLP.Text + 'brand-model-mobil'}
            >
              {recommendation.brand} {recommendation.model}
            </h3>
            <span className={styles.variantName}>
              {recommendation.variants[0].name}
            </span>
            <div
              className={styles.hargaOtrWrapper}
              data-testid={elementId.PLP.Text + 'harga-otr'}
            >
              <span className={styles.smallRegular}>Harga OTR</span>
              <span className={styles.smallSemibold}>{cityName}</span>
            </div>
            <div className={styles.carPriceWrapper}>
              <span
                className={styles.carPriceNew}
                data-testid={elementId.PLP.Text + 'harga-baru'}
              >
                Rp{regularCarPrice}
              </span>
              {discountedCarPrice ? (
                <span
                  className={styles.carPriceOld}
                  data-testid={elementId.PLP.Text + 'harga-lama'}
                >
                  Rp{regularCarPrice}
                </span>
              ) : (
                <></>
              )}
            </div>
            <div className={styles.infoWrapper}>
              <div
                className={styles.detailInfoWrapper}
                data-testid={elementId.PLP.Text + 'nominal-cicilan'}
              >
                <span className={styles.smallRegular}>Cicilan</span>
                <span className={styles.bodyPriceText}>
                  Rp
                  {discountedInstallment != 0
                    ? discountedInstallment
                    : regularInstallment}{' '}
                  jt
                </span>
                {discountedInstallment != 0 ? (
                  <span className={styles.bodyPriceTextCrossed}>
                    Rp{regularInstallment} jt
                  </span>
                ) : (
                  <div className={styles.crossedPricePlaceholder}></div>
                )}
              </div>
              <div
                className={styles.detailInfoWrapper}
                data-testid={elementId.PLP.Text + 'nominal-cicilan'}
              >
                <span className={styles.smallRegular}>DP</span>
                <span className={styles.bodyPriceText}>Rp{regularDp} jt</span>
                {discountedDp ? (
                  <span className={styles.bodyPriceTextCrossed}>
                    Rp{regularDp} jt(dmy)
                  </span>
                ) : (
                  <div className={styles.crossedPricePlaceholder}></div>
                )}
              </div>
              <div
                className={styles.detailInfoWrapper}
                data-testid={elementId.PLP.Text + 'lama-tenor'}
              >
                <span className={styles.smallRegular}>Tenor</span>
                <span className={styles.bodyPriceText}>
                  {selectedTenure} Tahun
                </span>
              </div>
            </div>
            <button
              className={styles.linkLihatDetail}
              onClick={() => onClickSeeDetail(recommendation)}
              data-testid={elementId.PLP.Button.LihatDetail}
            >
              Lihat Detail
            </button>
          </div>
          {renderCtaAndDisclaimer()}
        </CardShadow>
      </div>
      {datatoCaasDaas && (
        <LandingIA
          onClose={() => setOpenLandingIA(false)}
          dataToCaasDaas={datatoCaasDaas}
          open={openLandingIA}
          dataTrack={dataTrackLandingIA}
        />
      )}
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

export default CarDetailCardMultiCredit
