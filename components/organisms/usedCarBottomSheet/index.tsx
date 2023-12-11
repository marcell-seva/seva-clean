import React, { useContext, useEffect, useState } from 'react'
import { BottomSheetProps } from 'react-spring-bottom-sheet'
import clsx from 'clsx'
import {
  CreditCarCalculation,
  FinalLoan,
  InsuranceDataUsedCar,
  LoanCalculatorIncludePromoPayloadType,
  LoanCalculatorInsuranceAndPromoType,
  SelectedCalculateLoanUsedCar,
  SimpleCarVariantDetail,
} from 'utils/types/utils'
import { useContextCalculator } from 'services/context/calculatorContext'
import {
  getSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'
import { LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { BottomSheet, IconInfo } from 'components/atoms'
import FormSelectAssurance from 'components/molecules/form/formSelectAssurance'
import { UsedCarBottomList } from '../usedCarBottomList'
import PromoBottomCalculation from '../promoBottomCalculation'
import styles from 'styles/components/organisms/promoBottomSheet.module.scss'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { saveLocalStorage } from 'utils/handler/localStorage'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import FormSelectAssuranceUsedCar from 'components/molecules/form/formSelectAssuranceUsedCar'
import { assuranceOptionsUsedCar } from 'utils/config/funnel.config'
import UsedCarBottomCalculation from '../usedCarBottomCalculation'

interface PromoProps extends Omit<BottomSheetProps, 'children'> {
  onClose: () => void
  selectedTenure: number
  calculationApiPayload?: CreditCarCalculation
  promoInsuranceReal: InsuranceDataUsedCar[]
  setPromoInsuranceReal: (value: InsuranceDataUsedCar[]) => void
  onOpenInsuranceTooltip: () => void
  pageOrigination?: string
  isPartnership?: boolean
  data: SelectedCalculateLoanUsedCar[]
  setCalculationResult: any
}

const UsedCarBottomSheet = ({
  onClose,
  selectedTenure,
  calculationApiPayload,
  onOpenInsuranceTooltip,
  pageOrigination,
  isPartnership = false,
  data,
  setCalculationResult,
  promoInsuranceReal,
  setPromoInsuranceReal,
  ...props
}: PromoProps) => {
  const [promoInsuranceTemp, setPromoInsuranceTemp] =
    useState(promoInsuranceReal)
  const indexForSelectedTenure = data.findIndex(
    (obj: SelectedCalculateLoanUsedCar) => obj.tenor === selectedTenure,
  )
  const [tempFinal, setTempFinal] = useState({
    tenor: selectedTenure,
    totalTDP: 0,
    totalInstallment: 0,
  })
  const [isOpenToast, setIsOpenToast] = useState(false)
  const [isLoadingApiPromoList, setIsLoadingApiPromoList] = useState(false)
  const isCarDontHavePromo = 0
  const [simpleCarVariantDetails, setSimpleCarVariantDetails] =
    useLocalStorage<SimpleCarVariantDetail | null>(
      LocalStorageKey.SimpleCarVariantDetails,
      null,
    )

  const onChooseInsuranceItem = () => {
    const hasOpenedInsuranceToast: string =
      getSessionStorage(SessionStorageKey.HasOpenedInsuranceToast) ?? ''
    if (!hasOpenedInsuranceToast && !isCarDontHavePromo) {
      setIsOpenToast(true)
      saveSessionStorage(SessionStorageKey.HasOpenedInsuranceToast, 'true')
    }
  }

  useEffect(() => {
    if (isOpenToast) {
      setTimeout(() => {
        setIsOpenToast(false)
      }, 2000)
    }
  }, [isOpenToast])

  const onClickSubmit = () => {
    saveLocalStorage(
      LocalStorageKey.SelectablePromo,
      JSON.stringify(promoInsuranceTemp[indexForSelectedTenure]),
    )
    setPromoInsuranceReal(promoInsuranceTemp)
    onClose()
  }

  return (
    <BottomSheet
      title={`Tenor ${selectedTenure} Tahun`}
      onDismiss={() => {
        setPromoInsuranceTemp(promoInsuranceReal)
        setTempFinal({
          tenor: selectedTenure,
          totalTDP: 0,
          totalInstallment: 0,
        })
        onClose()
      }}
      maxHeight={window.innerHeight * 0.93}
      additionalHeaderClassname={styles.bottomSheetHeader}
      className={isPartnership ? styles.bottomSheetExtend : styles.bottomSheet}
      {...props}
    >
      <FormSelectAssuranceUsedCar
        selectedTenure={selectedTenure}
        onChooseInsuranceItem={onChooseInsuranceItem}
        calculationApiPayload={calculationApiPayload}
        isLoadingApiPromoList={isLoadingApiPromoList}
        setIsLoadingApiPromoList={setIsLoadingApiPromoList}
        promoInsuranceTemp={promoInsuranceTemp}
        setPromoInsuranceTemp={setPromoInsuranceTemp}
        onOpenInsuranceTooltip={onOpenInsuranceTooltip}
        pageOrigination={pageOrigination}
        setTempFinal={setTempFinal}
      />
      <div className={styles.lineDividerWhenCarDontHavePromoUsedCar} />
      <UsedCarBottomCalculation
        onClose={() => {
          onClickSubmit()
        }}
        regularTDP={parseInt(data[indexForSelectedTenure].totalDP)}
        finalTDP={tempFinal.totalTDP}
        regularInstallment={parseInt(
          data[indexForSelectedTenure].totalInstallment,
        )}
        finalInstallment={tempFinal.totalInstallment}
        isLoadingApiPromoList={isLoadingApiPromoList}
        setCalculationResult={setCalculationResult}
        data={data}
        tempFinal={tempFinal}
      />

      <div
        // not using ant design modal, because this toast use different relative positioning
        className={clsx({
          [styles.toast]: true,
          [styles.hideComponent]: !isOpenToast,
        })}
      >
        <IconInfo width={16} height={16} color="#FFFFFF" />
        <span className={styles.toastMessage}>
          Rekomendasi promo diterapkan secara otomatis
        </span>
      </div>
    </BottomSheet>
  )
}

export default UsedCarBottomSheet
