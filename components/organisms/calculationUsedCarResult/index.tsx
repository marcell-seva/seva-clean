import React, { useEffect, useRef, useState } from 'react'
import styles from 'styles/components/organisms/calculationResult.module.scss'
import {
  CreditCarCalculation,
  FormLCState,
  InsuranceDataUsedCar,
  LoanCalculatorInsuranceAndPromoType,
  SelectedCalculateLoanUsedCar,
  SpecialRateListWithPromoType,
  trackDataCarType,
} from 'utils/types/utils'
import { CalculationUsedCarResultItem } from 'components/molecules'
import { Button } from 'components/atoms'
import { InstallmentTypeOptions, LoanRank } from 'utils/types/models'
import elementId from 'helpers/elementIds'
import { ButtonSize, ButtonVersion, SessionStorageKey } from 'utils/enum'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { removeCarBrand } from 'utils/handler/removeCarBrand'
import {
  getSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'
import Image from 'next/image'
import UsedCarBottomSheet from '../usedCarBottomSheet'
import { InsuranceTooltip } from '../insuranceTooltip'
import { assuranceOptionsUsedCar } from 'utils/config/funnel.config'

const LogoAcc = '/revamp/icon/logo-acc.webp'

interface Props {
  data: SelectedCalculateLoanUsedCar[]
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
  calculationApiPayload?: CreditCarCalculation
  children?: React.ReactNode
  pageOrigination?: string
  scrollToLeads: any
  setCalculationResult: any
  setChosenAssurance: any
}

export const CalculationUsedCarResult = ({
  data,
  selectedLoan,
  setSelectedLoan,
  isTooltipOpen = false,
  formData,
  calculationApiPayload,
  pageOrigination,
  scrollToLeads,
  setCalculationResult,
  setChosenAssurance,
}: Props) => {
  const [state, setState] = useState<InsuranceDataUsedCar[]>(
    assuranceOptionsUsedCar,
  ) // assume this state as Context, mind about re-render

  const [tenureForPopUp, setTenureForPopUp] = useState(data[0].tenor)
  const [openPromo, setOpenPromo] = useState(false)
  const [openTooltipInsurance, setOpenTooltipInsurance] = useState(false)

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

  const handleOpenPopup = (selectedData: SelectedCalculateLoanUsedCar) => {
    setTenureForPopUp(selectedData.tenor)
    setOpenPromo(true)
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
          *Total DP: DP + Administrasi + Cicilan Pertama + Polis
          <br />
          **Cicilan per bulan: Sudah termasuk cicilan dan premi asuransi mobil
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
            <Button
              version={ButtonVersion.PrimaryDarkBlue}
              size={ButtonSize.Big}
              onClick={scrollToLeads}
              data-testid={elementId.LoanCalculator.Info.KualifikasiKredit}
            >
              Tanya Unit
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
      <h3 className={styles.title}>Simulasi Cicilan</h3>
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
      {selectedLoan && (
        <UsedCarBottomSheet
          data={data}
          open={openPromo}
          isPartnership={false}
          onClose={() => setOpenPromo(false)}
          selectedTenure={tenureForPopUp}
          calculationApiPayload={calculationApiPayload}
          promoInsuranceReal={state}
          setPromoInsuranceReal={(value: InsuranceDataUsedCar[]) => {
            setState(value)
          }}
          onOpenInsuranceTooltip={() => {
            setOpenPromo(false)
            setTimeout(() => {
              setOpenTooltipInsurance(true)
            }, 700)
          }}
          pageOrigination={pageOrigination}
          setCalculationResult={setCalculationResult}
          setChosenAssurance={setChosenAssurance}
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
