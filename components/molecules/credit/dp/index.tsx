import React, { useState, useEffect } from 'react'
import { Col, Input, Row, Slider } from 'antd'
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
  value: number
  percentage: number
  onChange: (
    value: number,
    percentage: number,
    mappedPercentage: number,
  ) => void
  emitDpPercentageChange: (
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
}

const DpForm: React.FC<DpFormProps> = ({
  label,
  value,
  percentage,
  onChange,
  emitDpPercentageChange,
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
  emitOnFocusDpPercentageField,
  emitOnAfterChangeDpSlider,
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
      if (
        numericValue >= carPriceMinusDiscount * 0.2 &&
        numericValue <= carPriceMinusDiscount * 0.9
      ) {
        setIsDpTooLow(false)
        setIsDpExceedLimit(false)
        onChange(
          numericValue,
          calculatePercentage(numericValue, carPriceMinusDiscount),
          getDpPercentageByMapping(numericValue),
        )
        handleChange(name, numericValue)
      } else if (numericValue < carPriceMinusDiscount * 0.2) {
        setIsDpTooLow(true)
        setIsDpExceedLimit(false)
      } else if (numericValue > carPriceMinusDiscount * 0.9) {
        setIsDpTooLow(false)
        setIsDpExceedLimit(true)
      }
    }
  }

  const handleValueBlur = () => {
    setFormattedValue(formatCurrency(value))
    if (value < carPriceMinusDiscount * 0.2) {
      setIsDpTooLow(true)
      setIsDpExceedLimit(false)
    } else if (value > carPriceMinusDiscount * 0.9) {
      setIsDpTooLow(false)
      setIsDpExceedLimit(true)
    } else {
      setIsDpTooLow(false)
      setIsDpExceedLimit(false)
    }
  }

  const handleSliderChange = (value: number) => {
    const numericValue = Number(value)

    if (
      numericValue >= carPriceMinusDiscount * 0.2 &&
      numericValue <= carPriceMinusDiscount * 0.9
    ) {
      setFormattedValue(formatCurrency(numericValue))
      setIsDpTooLow(false)
      setIsDpExceedLimit(false)
      onChange(
        numericValue,
        calculatePercentage(numericValue, carPriceMinusDiscount),
        getDpPercentageByMapping(numericValue),
      )
      handleChange(name, numericValue)
    } else if (numericValue < carPriceMinusDiscount * 0.2) {
      setIsDpTooLow(true)
      setIsDpExceedLimit(false)
    } else if (numericValue > carPriceMinusDiscount * 0.9) {
      setIsDpTooLow(false)
      setIsDpExceedLimit(true)
    }
  }

  const calculateValue = (percentage: number, carPrice: number): number => {
    return (carPrice * percentage) / 100
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

  const sliderIconStyle = {
    width: 24,
    height: 24,
    marginLeft: '10px',
  }

  const handleDpPercentageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const inputtedPercentage = event.target.value
    const numericPercentage = Number(inputtedPercentage.replace(/\D/g, ''))

    if (!isNaN(numericPercentage)) {
      const dpValue = calculateValue(numericPercentage, carPriceMinusDiscount)
      setFormattedValue(formatCurrency(dpValue))
      handleChange(name, dpValue)
      emitDpPercentageChange(
        dpValue,
        numericPercentage,
        getDpPercentageByMapping(dpValue),
      )

      if (
        dpValue >= carPriceMinusDiscount * 0.2 &&
        dpValue <= carPriceMinusDiscount * 0.9
      ) {
        setIsDpTooLow(false)
        setIsDpExceedLimit(false)
        onChange(dpValue, numericPercentage, getDpPercentageByMapping(dpValue))
      } else if (dpValue < carPriceMinusDiscount * 0.2) {
        setIsDpTooLow(true)
        setIsDpExceedLimit(false)
      } else if (dpValue > carPriceMinusDiscount * 0.9) {
        setIsDpTooLow(false)
        setIsDpExceedLimit(true)
      }
    }
  }

  return (
    <div className={styles.wrapper}>
      <label className={styles.titleText}>{label}</label>
      <Row gutter={16}>
        <Col span={18}>
          <Input
            type="tel"
            className={styles.input}
            value={formattedValue}
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
                DP yang kamu masukkan terlalu rendah
              </span>
            </div>
          )}
          {isDpExceedLimit && (
            <div className={styles.errorMessageWrapper}>
              <span className={styles.errorMessage}>
                DP yang kamu masukkan melebihi 90%
              </span>
            </div>
          )}
        </Col>
        <Col span={6} style={{ gap: '16px', alignItems: 'center' }}>
          <Input
            type="tel"
            className={clsx({
              [styles.input]: true,
              [styles.inputDisabled]: isDisabled,
            })}
            value={`${percentage}`}
            onChange={handleDpPercentageChange}
            disabled={isDisabled}
            suffix="%"
            maxLength={2}
            data-testid={elementId.Field.DPPercentage}
            onFocus={() => {
              emitOnFocusDpPercentageField && emitOnFocusDpPercentageField()
            }}
          />
        </Col>
      </Row>
      {isErrorEmptyField ? (
        <div className={styles.errorMessageWrapper}>
          <span className={styles.errorMessage}>Wajib diisi</span>
        </div>
      ) : (
        <></>
      )}
      <Row data-testid={elementId.LoanCalculator.SliderDP}>
        <Slider
          className={styles.slider}
          min={carPriceMinusDiscount * 0.2}
          max={carPriceMinusDiscount * 0.9}
          step={100000}
          value={value}
          onChange={handleSliderChange}
          handleStyle={sliderIconStyle}
          disabled={isDisabled}
          onAfterChange={() => {
            emitOnAfterChangeDpSlider && emitOnAfterChangeDpSlider()
          }}
        />
      </Row>
      <Row>
        <div className={styles.labelSliderContent}>
          <Row>
            <span className={styles.labelSliderOne}>
              {formatCurrency(carPriceMinusDiscount * 0.2)}
            </span>
            <span className={styles.labelSliderTwo}>
              {formatCurrency(carPriceMinusDiscount * 0.9)}
            </span>
          </Row>
        </div>
      </Row>
    </div>
  )
}

export default DpForm
