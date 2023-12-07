import React, { useState, useEffect } from 'react'
import { Input } from 'antd'
import styles from 'styles/components/molecules/dp/dpform.module.scss'
import { dpRateCollectionNewCalculator } from 'utils/helpers/const'
import {
  dpRateCollectionNewCalculatorTmp,
  FormLCState,
} from 'utils/types/utils'
import clsx from 'clsx'
import elementId from 'helpers/elementIds'
import { SessionStorageKey } from 'utils/enum'
import { getSessionStorage } from 'utils/handler/sessionStorage'

interface DpFormProps {
  label: string
  labelWithCta?: string
  value: number
  percentage?: number
  onChange: (
    value: number,
    percentage: number,
    mappedPercentage: number,
  ) => void
  emitDpPercentageChange?: (
    value: number,
    percentage: number,
    mappedPercentage: number,
  ) => void
  carPriceMinusDiscount: number
  handleChange: (name: string, value: any) => void
  name: string
  isErrorEmptyField: boolean
  isDisabled: boolean
  isDpTooLow: boolean
  setIsDpTooLow: (value: boolean) => void
  isDpExceedLimit: boolean
  setIsDpExceedLimit: (value: boolean) => void
  isAutofillValueFromCreditQualificationData?: boolean
  emitOnFocusDpAmountField?: () => void
  emitOnFocusDpPercentageField?: () => void
  emitOnAfterChangeDpSlider?: () => void
  finalMinInputDp: number
  finalMaxInputDp: number
  setIsOpenEducationalPopup?: (value: boolean) => void
}

const DpForm: React.FC<DpFormProps> = ({
  label,
  labelWithCta,
  value,
  onChange,
  carPriceMinusDiscount,
  handleChange,
  name,
  isErrorEmptyField,
  isDisabled,
  isDpTooLow,
  setIsDpTooLow,
  isDpExceedLimit,
  setIsDpExceedLimit,
  isAutofillValueFromCreditQualificationData = false,
  emitOnFocusDpAmountField,
  finalMinInputDp,
  finalMaxInputDp,
  setIsOpenEducationalPopup,
}) => {
  const formatCurrency = (value: number): string => {
    return `Rp${value.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`
  }

  const [formattedValue, setFormattedValue] = useState<string>(
    formatCurrency(value),
  )

  const kkForm: FormLCState | null = getSessionStorage(
    SessionStorageKey.KalkulatorKreditForm,
  )

  useEffect(() => {
    setIsDpTooLow(false)
    setIsDpExceedLimit(false)
    if (isAutofillValueFromCreditQualificationData) {
      const initialDpValue = kkForm?.downPaymentAmount
        ? parseInt(kkForm?.downPaymentAmount)
        : 0
      const carOtrFromStorage = parseInt(
        kkForm?.variant?.otr.replaceAll('Rp', '').replaceAll('.', '') ?? '0',
      )
      const carDiscountFromStorage = kkForm?.variant?.discount ?? 0
      const carPriceMinusDiscountFromStorage =
        carOtrFromStorage - carDiscountFromStorage
      setFormattedValue(formatCurrency(initialDpValue))
      onChange(
        initialDpValue,
        calculatePercentage(initialDpValue, carPriceMinusDiscountFromStorage),
        getDpPercentageByMapping(initialDpValue),
      )
      handleChange(name, initialDpValue)
    } else {
      const initialDpValue = carPriceMinusDiscount * 0.2
      setFormattedValue(formatCurrency(initialDpValue))
      onChange(
        initialDpValue,
        calculatePercentage(initialDpValue, carPriceMinusDiscount),
        getDpPercentageByMapping(initialDpValue),
      )
      handleChange(name, initialDpValue)
    }
  }, [carPriceMinusDiscount])

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputtedValue = event.target.value
    const numericValue = Number(inputtedValue.replace(/\D/g, ''))

    if (!isNaN(numericValue)) {
      setFormattedValue(formatCurrency(numericValue))
      setIsDpTooLow(false)
      setIsDpExceedLimit(false)
      onChange(
        numericValue,
        calculatePercentage(numericValue, carPriceMinusDiscount),
        getDpPercentageByMapping(numericValue),
      )
      handleChange(name, numericValue)
    }
  }

  const handleValueBlur = () => {
    setFormattedValue(formatCurrency(value))
  }

  const calculatePercentage = (dpValue: number, carPrice: number): number => {
    if (dpValue == 0 || carPrice == 0) {
      return 20
    }
    return Math.round((dpValue / carPrice) * 100)
  }

  const getDpPercentageByMapping = (dpValue: number) => {
    const dpOtr = dpRateCollectionNewCalculator.map(
      (dp: dpRateCollectionNewCalculatorTmp) => {
        return {
          ...dp,
          dpCalc: dp.dpCalc * carPriceMinusDiscount,
        }
      },
    )

    if (dpValue >= carPriceMinusDiscount * 0.5) {
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

  return (
    <div className={styles.wrapper}>
      {labelWithCta && labelWithCta.length !== 0 ? (
        <>
          <label className={styles.titleText}>{label}</label>
          <label
            className={styles.titleWithCtaText}
            onClick={() =>
              setIsOpenEducationalPopup && setIsOpenEducationalPopup(true)
            }
          >
            {labelWithCta}
          </label>
        </>
      ) : (
        <label className={styles.titleText}>{label}</label>
      )}
      <Input
        type="tel"
        className={clsx({
          [styles.input]: true,
          [styles.error]: isErrorEmptyField || isDpTooLow || isDpExceedLimit,
        })}
        value={
          parseInt(formattedValue.replace('Rp', '')) > 0
            ? formattedValue
            : undefined // use "undefined" so that placeholder will be shown
        }
        placeholder="Masukkan DP"
        onChange={handleValueChange}
        onBlur={handleValueBlur}
        name={name}
        disabled={isDisabled}
        data-testid={elementId.Field.DP}
        onFocus={() => {
          emitOnFocusDpAmountField && emitOnFocusDpAmountField()
        }}
      />
      {isDpTooLow && (
        <div className={`${styles.errorMessageWrapper} shake-animation-X`}>
          <span className={styles.errorMessage}>
            Berdasarkan harga mobil yang Anda pilih, min. DP{' '}
            {formatCurrency(finalMinInputDp)}
          </span>
        </div>
      )}
      {isDpExceedLimit && (
        <div className={styles.errorMessageWrapper}>
          <span className={styles.errorMessage}>
            Berdasarkan harga mobil yang Anda pilih, maks. DP{' '}
            {formatCurrency(finalMaxInputDp)}
          </span>
        </div>
      )}
      {isErrorEmptyField ? (
        <div className={styles.errorMessageWrapper}>
          <span className={styles.errorMessage}>Wajib diisi</span>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default DpForm
