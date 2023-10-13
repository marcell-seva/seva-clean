import React, { useEffect, useRef, useState } from 'react'
import styles from 'styles/components/organisms/calculationResult.module.scss'
import {
  FinalLoan,
  FormLCState,
  LoanCalculatorIncludePromoPayloadType,
  LoanCalculatorInsuranceAndPromoType,
  SpecialRateListWithPromoType,
  trackDataCarType,
} from 'utils/types/utils'
import { CalculationResultItem } from 'components/molecules'
import { Button, IconWhatsapp, Overlay } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { InstallmentTypeOptions, LoanRank } from 'utils/types/models'
import { Tooltip } from 'antd'
import TooltipContentQualifacation from 'components/molecules/tooltipContent'
import {
  trackLCKualifikasiKreditTooltipCTAClick,
  trackLCKualifikasiKreditTooltipCTACloseClick,
} from 'helpers/amplitude/seva20Tracking'
import { replacePriceSeparatorByLocalization } from 'utils/handler/rupiah'
import elementId from 'helpers/elementIds'
import PromoBottomSheet from '../promoBottomSheet'
import { LanguageCode, SessionStorageKey } from 'utils/enum'
import { InsuranceTooltip } from '../insuranceTooltip'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { removeCarBrand } from 'utils/handler/removeCarBrand'
import {
  getSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'
import Image from 'next/image'

const LogoAcc = '/revamp/icon/logo-acc.webp'
const LogoTaf = '/revamp/icon/logo-taf.webp'

interface Props {
  data: SpecialRateListWithPromoType[]
  selectedLoan: SpecialRateListWithPromoType | null
  setSelectedLoan: (value: SpecialRateListWithPromoType) => void
  angsuranType: InstallmentTypeOptions
  handleRedirectToWhatsapp: (loan: SpecialRateListWithPromoType) => void
  isTooltipOpen: boolean
  isQualificationModalOpen: boolean
  closeTooltip: () => void
  handleClickButtonQualification: (loan: SpecialRateListWithPromoType) => void
  formData: FormLCState
  insuranceAndPromoForAllTenure: LoanCalculatorInsuranceAndPromoType[]
  setInsuranceAndPromoForAllTenure: (
    value: LoanCalculatorInsuranceAndPromoType[],
  ) => void
  calculationApiPayload?: LoanCalculatorIncludePromoPayloadType
  children?: React.ReactNode
  setFinalLoan: (value: FinalLoan) => void
  pageOrigination?: string
}

export const CalculationResult = ({
  data,
  selectedLoan,
  setSelectedLoan,
  angsuranType,
  handleRedirectToWhatsapp,
  isTooltipOpen = false,
  closeTooltip,
  handleClickButtonQualification,
  formData,
  insuranceAndPromoForAllTenure,
  setInsuranceAndPromoForAllTenure,
  calculationApiPayload,
  setFinalLoan,
  pageOrigination,
}: Props) => {
  const [state, setState] = useState<LoanCalculatorInsuranceAndPromoType[]>(
    insuranceAndPromoForAllTenure,
  ) // assume this state as Context, mind about re-render
  const [tenureForPopUp, setTenureForPopUp] = useState(data[0].tenure)
  const [openPromo, setOpenPromo] = useState(false)
  const [openTooltipInsurance, setOpenTooltipInsurance] = useState(false)
  const [selectedCalculatePromo, setSelectedCalculatePromo] =
    useState<LoanCalculatorInsuranceAndPromoType | null>()

  const trackCountlyClickResultItem = (
    selectedTenureData: SpecialRateListWithPromoType,
  ) => {
    trackEventCountly(CountlyEventNames.WEB_LOAN_CALCULATOR_PAGE_TENURE_CLICK, {
      PAGE_ORIGINATION: pageOrigination,
      CAR_BRAND: formData.model?.brandName ?? 'Null',
      CAR_MODEL: formData.model?.modelName ?? 'Null',
      CAR_VARIANT: formData.variant?.variantName ?? 'Null',
      TENOR_OPTION: `${selectedTenureData.tenure} Tahun`,
      TENOR_RESULT:
        selectedTenureData.loanRank === LoanRank.Green
          ? 'Mudah disetujui'
          : 'Sulit disetujui',
    })
  }

  const trackCountlyOpenPromoPopup = (
    selectedTenure: SpecialRateListWithPromoType,
    selectedTenurePromoData: LoanCalculatorInsuranceAndPromoType,
  ) => {
    trackEventCountly(
      CountlyEventNames.WEB_LOAN_CALCULATOR_PAGE_TENURE_PROMO_CLICK,
      {
        PAGE_ORIGINATION: pageOrigination,
        TENOR_OPTION: `${selectedTenure.tenure} Tahun`,
        TENOR_RESULT:
          selectedTenure.loanRank === LoanRank.Green
            ? 'Mudah disetujui'
            : 'Sulit disetujui',
        TOTAL_APPLIED_PROMO: `${selectedTenurePromoData?.selectedPromo?.length} Promo`,
      },
    )
  }

  const saveDataCarForLoginPageView = (
    tenure: string,
    resultLoanRank: string,
  ) => {
    const dataCar: trackDataCarType | null = getSessionStorage(
      SessionStorageKey.PreviousCarDataBeforeLogin,
    )
    const dataCarTemp = {
      ...dataCar,
      TENOR_OPTION: tenure,
      TENOR_RESULT: resultLoanRank,
    }
    saveSessionStorage(
      SessionStorageKey.PreviousCarDataBeforeLogin,
      JSON.stringify(dataCarTemp),
    )
  }
  const handleOnClickResultItem = (value: SpecialRateListWithPromoType) => {
    trackCountlyClickResultItem(value)
    saveDataCarForLoginPageView(value.tenure.toString(), value.loanRank)
    setSelectedLoan(value)
    const selectedData = state.filter((item) => item.tenure === value.tenure)[0]

    setFinalLoan({
      selectedInsurance: selectedData.selectedInsurance,
      selectedPromoFinal: selectedData.selectedPromo,
      tppFinal: selectedData.tdpAfterPromo,
      installmentFinal: selectedData.installmentAfterPromo,
      interestRateFinal: selectedData.interestRateAfterPromo,
      installmentBeforePromo: selectedData.installmentBeforePromo,
      interestRateBeforePromo: selectedData.interestRateBeforePromo,
      tdpBeforePromo: selectedData.tdpBeforePromo,
    })
  }

  const getLoanRank = (rank: string) => {
    if (rank === LoanRank.Green) {
      return 'Mudah'
    } else if (rank === LoanRank.Red) {
      return 'Sulit'
    }

    return ''
  }

  useEffect(() => {
    if (isTooltipOpen) {
      scrollToSection()
    }
  }, [isTooltipOpen])

  const goToButton = useRef<null | HTMLDivElement>(null)
  const scrollToSection = () => {
    goToButton.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'end',
    })
  }

  const trackCountlyOnClickUnderstandTooltip = () => {
    trackEventCountly(
      CountlyEventNames.WEB_LOAN_CALCULATOR_PAGE_KUALIFIKASI_KREDIT_COACHMARK_CLICK,
      {
        PAGE_ORIGINATION: pageOrigination,
        CAR_BRAND: formData.model?.brandName ?? 'Null',
        CAR_MODEL: removeCarBrand(formData.model?.modelName ?? 'Null'),
        CAR_VARIANT: formData.variant?.variantName ?? 'Null',
      },
    )
  }

  const handleUnderstandTooltip = () => {
    if (selectedLoan) {
      trackCountlyOnClickUnderstandTooltip()
      trackLCKualifikasiKreditTooltipCTAClick({
        Age: `${formData.age} Tahun`,
        Angsuran_Type: formData.paymentOption,
        Car_Brand: formData?.model?.brandName || '',
        Car_Model: formData?.model?.modelName || '',
        Car_Variant: formData.variant?.variantName || '',
        City: formData.city.cityName,
        DP: `Rp${replacePriceSeparatorByLocalization(
          formData.downPaymentAmount,
          LanguageCode.id,
        )}`,
        Page_Origination: window.location.href,
        Promo: formData.promoCode,
        Monthly_Installment: `Rp${replacePriceSeparatorByLocalization(
          selectedLoan.installment,
          LanguageCode.id,
        )}`,
        Peluang_Kredit: getLoanRank(selectedLoan.loanRank),
        Tenure: `${selectedLoan.tenure} Tahun`,
        Total_DP: `Rp${replacePriceSeparatorByLocalization(
          selectedLoan.dpAmount,
          LanguageCode.id,
        )}`,
      })
    }

    closeTooltip()
  }

  const handleCloseTooltip = () => {
    if (selectedLoan) {
      trackLCKualifikasiKreditTooltipCTACloseClick({
        Age: `${formData.age} Tahun`,
        Angsuran_Type: formData.paymentOption,
        Car_Brand: formData?.model?.brandName || '',
        Car_Model: formData?.model?.modelName || '',
        Car_Variant: formData.variant?.variantName || '',
        City: formData.city.cityName,
        DP: `Rp${replacePriceSeparatorByLocalization(
          formData.downPaymentAmount,
          LanguageCode.id,
        )}`,
        Page_Origination: window.location.href,
        Promo: formData.promoCode,
        Monthly_Installment: `Rp${replacePriceSeparatorByLocalization(
          selectedLoan.installment,
          LanguageCode.id,
        )}`,
        Peluang_Kredit: getLoanRank(selectedLoan.loanRank),
        Tenure: `${selectedLoan.tenure} Tahun`,
        Total_DP: `Rp${replacePriceSeparatorByLocalization(
          selectedLoan.dpAmount,
          LanguageCode.id,
        )}`,
      })
    }

    closeTooltip()
  }

  const handleOpenPopup = (selectedData: SpecialRateListWithPromoType) => {
    setTenureForPopUp(selectedData.tenure)
    setOpenPromo(true)
    const selectPromo = state.filter((x) => x.tenure === selectedData.tenure)
    trackCountlyOpenPromoPopup(selectedData, selectPromo[0])
    setSelectedCalculatePromo(selectPromo[0])
    setFinalLoan({
      selectedInsurance: selectPromo[0].selectedInsurance,
      selectedPromoFinal: selectPromo[0].selectedPromo,
      tppFinal: selectPromo[0].tdpAfterPromo,
      installmentFinal: selectPromo[0].installmentAfterPromo,
      interestRateFinal: selectPromo[0].interestRateAfterPromo,
      installmentBeforePromo: selectPromo[0].installmentBeforePromo,
      interestRateBeforePromo: selectPromo[0].interestRateBeforePromo,
      tdpBeforePromo: selectPromo[0].tdpBeforePromo,
    })
  }

  const renderLogoFinco = () => {
    return (
      <div className={styles.logoFincoWrapper}>
        <Image
          src={LogoAcc}
          width={24.24}
          height={32}
          className={styles.logoAcc}
          alt="logo acc"
        />
        <Image
          src={LogoTaf}
          width={37}
          height={19}
          className={styles.logoTaf}
          alt="logo taf"
        />
      </div>
    )
  }

  const renderDisclaimer = () => {
    return (
      <div className={styles.disclaimerWrapper}>
        {angsuranType === InstallmentTypeOptions.ADDM ? (
          <span className={styles.disclaimerText}>
            *Total DP: DP + Administrasi + Cicilan Pertama + Polis + TJH
            <br />
            **Cicilan per bulan: Sudah termasuk cicilan dan premi asuransi mobil
            <br />
            Perhitungan kredit ini disediakan oleh ACC dan TAF.
          </span>
        ) : (
          <span className={styles.disclaimerText}>
            *Total DP: DP + Administrasi + Polis + TJH
            <br />
            **Cicilan per bulan: Sudah termasuk cicilan dan premi asuransi mobil
            <br />
            Perhitungan kredit ini disediakan oleh ACC dan TAF.
          </span>
        )}
      </div>
    )
  }

  const renderCtaAndDisclaimer = () => {
    if (selectedLoan) {
      return (
        <>
          <div className={styles.ctaGroup}>
            {!isTooltipOpen && (
              <Button
                version={ButtonVersion.PrimaryDarkBlue}
                size={ButtonSize.Big}
                onClick={() => handleClickButtonQualification(selectedLoan)}
                data-testid={elementId.LoanCalculator.Info.KualifikasiKredit}
              >
                Cek Kualifikasi Kredit
              </Button>
            )}

            {isTooltipOpen && (
              <>
                <Overlay
                  isShow={isTooltipOpen}
                  onClick={handleCloseTooltip}
                  zIndex={998}
                  additionalstyle={styles.overlayAdditionalStyle}
                />
                <div style={{ width: '100%' }}>
                  <Tooltip
                    title={
                      <TooltipContentQualifacation
                        onClick={handleUnderstandTooltip}
                      />
                    }
                    color="#246ED4"
                    placement="top"
                    className="calculation-result"
                    visible={isTooltipOpen}
                    overlayClassName="calculation-result"
                  >
                    <div
                      ref={goToButton}
                      className={isTooltipOpen ? styles.bordered : ''}
                    >
                      <Button
                        version={ButtonVersion.PrimaryDarkBlue}
                        size={ButtonSize.Big}
                        onClick={closeTooltip}
                      >
                        Cek Kualifikasi Kredit
                      </Button>
                    </div>
                  </Tooltip>
                </div>
              </>
            )}

            <Button
              version={ButtonVersion.Secondary}
              size={ButtonSize.Big}
              onClick={() => handleRedirectToWhatsapp(selectedLoan)}
              data-testid={elementId.LoanCalculator.Button.HubungiAgenSeva}
            >
              <div className={styles.whatsappCtaTextWrapper}>
                <IconWhatsapp width={16} height={16} />
                Hubungi Agen SEVA
              </div>
            </Button>
          </div>
          {renderDisclaimer()}
          {renderLogoFinco()}
        </>
      )
    }
  }

  return (
    <div
      className={styles.container}
      data-testid={elementId.LoanCalculator.Result.LoanCalculator}
    >
      <h3 className={styles.title}>Kemampuan Finansialmu</h3>
      <span className={styles.subtitle}>
        Perhitungan final akan diberikan oleh partner SEVA.
      </span>
      <div className={styles.dataHeaderWrapper}>
        <span className={`${styles.dataHeaderText} ${styles.tenorHeader}`}>
          Tenor
        </span>
        <span className={styles.dataHeaderText}>Total DP*</span>
        <span className={styles.dataHeaderText}>Cicilan per bulan**</span>
      </div>
      <div className={styles.listWrapper}>
        {data.map((item, index) => {
          return (
            <CalculationResultItem
              data={item}
              key={index}
              emitOnClick={handleOnClickResultItem}
              isActive={item.tenure === selectedLoan?.tenure}
              onClickBottomSection={handleOpenPopup}
              insuranceAndPromoData={
                state.filter(
                  (selectedDataItem) => selectedDataItem.tenure === item.tenure,
                )[0]
              }
            />
          )
        })}
      </div>
      {selectedCalculatePromo && (
        <PromoBottomSheet
          open={openPromo}
          onClose={() => setOpenPromo(false)}
          selectedTenure={tenureForPopUp}
          selectedCalculatePromoInsurance={selectedCalculatePromo}
          calculationApiPayload={calculationApiPayload}
          promoInsuranceReal={state}
          setPromoInsuranceReal={(
            value: LoanCalculatorInsuranceAndPromoType[],
          ) => {
            setState(value)
            setInsuranceAndPromoForAllTenure(value)
          }}
          setFinalLoan={setFinalLoan}
          onOpenInsuranceTooltip={() => {
            setOpenPromo(false)
            setTimeout(() => {
              setOpenTooltipInsurance(true)
            }, 700)
          }}
          pageOrigination={pageOrigination}
        />
      )}
      <InsuranceTooltip
        open={openTooltipInsurance}
        onClose={() => {
          setOpenTooltipInsurance(false)
          setTimeout(() => {
            setOpenPromo(true)
          }, 700)
        }}
      />

      {renderCtaAndDisclaimer()}
    </div>
  )
}
