import React, { useEffect, useRef, useState } from 'react'
import styles from 'styles/components/organisms/calculationResult.module.scss'
import {
  FinalLoan,
  FormLCState,
  LoanCalculatorIncludePromoPayloadType,
  LoanCalculatorInsuranceAndPromoType,
  SelectedCalculateLoanUsedCar,
  SpecialRateListWithPromoType,
  trackDataCarType,
} from 'utils/types/utils'
import { CalculationUsedCarResultItem } from 'components/molecules'
import { Button, IconWhatsapp, Overlay } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { InstallmentTypeOptions, LoanRank } from 'utils/types/models'
import Tooltip from 'antd/lib/tooltip'
import TooltipContentQualifacation from 'components/molecules/tooltipContent'
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
  selectedLoan: SelectedCalculateLoanUsedCar | null
  setSelectedLoan: (value: SelectedCalculateLoanUsedCar) => void
  angsuranType: InstallmentTypeOptions
  isTooltipOpen: boolean
  isQualificationModalOpen: boolean
  closeTooltip: () => void
  handleClickButtonQualification: (loan: SelectedCalculateLoanUsedCar) => void
  formData: FormLCState
  insuranceAndPromoForAllTenure: LoanCalculatorInsuranceAndPromoType[]
  setInsuranceAndPromoForAllTenure: (
    value: LoanCalculatorInsuranceAndPromoType[],
  ) => void
  calculationApiPayload?: LoanCalculatorIncludePromoPayloadType
  children?: React.ReactNode
  setFinalLoan: (value: FinalLoan) => void
  pageOrigination?: string
  scrollToLeads: any
}

export const CalculationUsedCarResult = ({
  data,
  selectedLoan,
  setSelectedLoan,
  angsuranType,
  isTooltipOpen = false,
  closeTooltip,
  handleClickButtonQualification,
  formData,
  insuranceAndPromoForAllTenure,
  setInsuranceAndPromoForAllTenure,
  calculationApiPayload,
  setFinalLoan,
  pageOrigination,
  scrollToLeads,
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
  const handleOnClickResultItem = (value: any) => {
    trackCountlyClickResultItem(value)
    saveDataCarForLoginPageView(value.tenor.toString(), value.loanRank)
    setSelectedLoan(value)
    const selectedData = data.filter(
      (item: any) => item.tenor === value.tenor,
    )[0]

    // setFinalLoan({
    //   selectedInsurance: selectedData.selectedInsurance,
    //   selectedPromoFinal: selectedData.selectedPromo,
    //   tppFinal: selectedData.tdpAfterPromo,
    //   installmentFinal: selectedData.installmentAfterPromo,
    //   interestRateFinal: selectedData.interestRateAfterPromo,
    //   installmentBeforePromo: selectedData.installmentBeforePromo,
    //   interestRateBeforePromo: selectedData.interestRateBeforePromo,
    //   tdpBeforePromo: selectedData.tdpBeforePromo,
    // })
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
    if (selectedLoan) trackCountlyOnClickUnderstandTooltip()
    closeTooltip()
  }

  const handleCloseTooltip = () => {
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
      </div>
    )
  }

  const renderDisclaimer = () => {
    return (
      <div className={styles.disclaimerWrapper}>
        <span className={styles.disclaimerText}>
          *Total DP: Administrasi + 2 (dua) kali deposit angsuran
          <br />
          **Cicilan per bulan: cicilan + premi asuransi mobil (1 Tahun
          Comprehensive, sisanya TLO)
          <br />
          ***Hasil perhitungan masih bersifat estimasi. Perhitungan final akan
          diberikan oleh partner SEVA
          <br />
          <br />
          Perhitungan kredit ini disediakan oleh ACC.
        </span>
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
                onClick={scrollToLeads}
                data-testid={elementId.LoanCalculator.Info.KualifikasiKredit}
              >
                Tanya Unit
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
      <h3 className={styles.title}>Pilih Angsuran</h3>
      <span className={styles.subtitle}>
        Perhitungan final akan diberikan oleh partner SEVA.
      </span>
      <div className={styles.dataHeaderWrapperUsedCar}>
        <span className={`${styles.dataHeaderText}`}>Tenor</span>
        <span className={styles.dataHeaderText}>Total DP*</span>
        <span className={styles.dataHeaderText}>Cicilan per bulan**</span>
      </div>
      <div className={styles.listWrapper}>
        {data.map((item: any, index) => {
          return (
            <CalculationUsedCarResultItem
              data={item}
              key={index}
              emitOnClick={handleOnClickResultItem}
              isActive={item.tenor === selectedLoan?.tenor}
              onClickBottomSection={handleOpenPopup}
            />
          )
        })}
      </div>
      {renderCtaAndDisclaimer()}
    </div>
  )
}
