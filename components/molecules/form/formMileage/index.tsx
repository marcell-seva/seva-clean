import React, { ChangeEvent, useEffect, useState } from 'react'
import styles from 'styles/components/molecules/form/formYear.module.scss'
import { Input, Slider } from 'antd'
import { addSeparator, filterNonDigitCharacters } from 'utils/stringUtils'
import { useFunnelQueryUsedCarData } from 'services/context/funnelQueryUsedCarContext'
import elementId from 'helpers/elementIds'

type FormMileageProps = {
  minMaxMileage?: any
  setMinMileageFilter?: any
  setMaxMileageFilter?: any
  isResetFilter?: boolean
  setIsErrorForm?: any
  isApplied?: boolean
  isButtonClick: boolean
}
export const FormMileage = ({
  minMaxMileage,
  setMinMileageFilter,
  setMaxMileageFilter,
  isResetFilter,
  setIsErrorForm,
  isApplied,
  isButtonClick,
}: FormMileageProps) => {
  const { funnelQuery } = useFunnelQueryUsedCarData()

  const [minDefault] = useState(minMaxMileage.minMileageValue)
  const [maxDefault] = useState(minMaxMileage.maxMileageValue)
  const [minTemp, setMinTemp] = useState(
    funnelQuery.mileageStart
      ? funnelQuery.mileageStart?.toString()
      : minMaxMileage.minMileageValue,
  )
  const [maxTemp, setMaxTemp] = useState(
    funnelQuery.mileageEnd
      ? funnelQuery.mileageEnd?.toString()
      : minMaxMileage.maxMileageValue,
  )
  const [isErrorMin, setIsErrorMin] = useState(false)
  const [isErrorMax, setIsErrorMax] = useState(false)
  const [isErrorMinTwo, setIsErrorMinTwo] = useState(false)
  const [isErrorMaxTwo, setIsErrorMaxTwo] = useState(false)
  const [minTempCurrency, setMinTempCurrency] = useState(
    funnelQuery.mileageStart
      ? separatorThousand(funnelQuery.mileageStart?.toString())
      : separatorThousand(minMaxMileage.minMileageValue),
  )
  const [maxTempCurrency, setMaxTempCurrency] = useState(
    funnelQuery.mileageEnd
      ? separatorThousand(funnelQuery.mileageEnd?.toString())
      : separatorThousand(minMaxMileage.maxMileageValue),
  )

  const onChangeInputMinimum = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value
    const numberOnly = input.replace(/\D/g, '')
    if (numberOnly[0] === '0') {
      return
    }
    if (
      Number(filterNonDigitCharacters(numberOnly)) < minDefault &&
      numberOnly
    ) {
      setIsErrorMin(true)
    } else {
      setIsErrorMin(false)
    }
    if (Number(filterNonDigitCharacters(numberOnly)) > maxTemp) {
      setIsErrorMinTwo(true)
      setIsErrorForm(true)
    } else {
      setIsErrorMinTwo(false)
      setIsErrorForm(false)
    }
    setIsErrorMaxTwo(false)
    setMinTempCurrency(separatorThousand(numberOnly))
    setMinMileageFilter(filterNonDigitCharacters(numberOnly))
    setMinTemp(Number(filterNonDigitCharacters(numberOnly)))
    return
  }
  const onChangeInputMaximum = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value
    const numberOnly = input.replace(/\D/g, '')
    if (numberOnly[0] === '0') {
      return
    }
    if (
      Number(filterNonDigitCharacters(numberOnly)) > maxDefault &&
      numberOnly
    ) {
      setIsErrorMax(true)
    } else {
      setIsErrorMax(false)
    }
    if (Number(filterNonDigitCharacters(numberOnly)) < minTemp) {
      setIsErrorMaxTwo(true)
      setIsErrorForm(true)
    } else {
      setIsErrorForm(false)
      setIsErrorMaxTwo(false)
    }
    setIsErrorMinTwo(false)
    setMaxMileageFilter(filterNonDigitCharacters(numberOnly))
    setMaxTempCurrency(separatorThousand(numberOnly))
    setMaxTemp(Number(filterNonDigitCharacters(numberOnly)))
    return
  }
  const onChangeSlider = (newValue: any) => {
    setMinTemp(newValue[0])
    setMinTempCurrency(newValue[0].toString())
    setMinMileageFilter(newValue[0].toString())
    setMaxMileageFilter(newValue[1].toString())
    setMaxTemp(newValue[1])
    setMaxTempCurrency(newValue[1].toString())
    if (newValue[0] > minDefault) {
      setIsErrorMin(false)
      setIsErrorMinTwo(false)
    }
    if (newValue[1] < maxDefault) {
      setIsErrorMax(false)
      setIsErrorMaxTwo(false)
    }
    if (newValue[0] > minDefault && newValue[1] < maxDefault) {
      setIsErrorForm(false)
    }
  }

  useEffect(() => {
    if (isResetFilter) {
      setMinTemp(minMaxMileage.minMileageValue)
      setMaxTemp(minMaxMileage.maxMileageValue)
      setMinTempCurrency(minMaxMileage.minMileageValue)
      setMaxTempCurrency(minMaxMileage.maxMileageValue)
    }
    if (funnelQuery.mileageEnd && !isApplied) {
      if (maxTemp === minMaxMileage.maxMileageValue) {
        setMaxTemp(funnelQuery.mileageEnd?.toString())
        setMaxTempCurrency(
          separatorThousand(funnelQuery.mileageEnd?.toString()),
        )
      }
      if (minTemp === minMaxMileage.minMileageValue) {
        setMinTemp(funnelQuery.mileageStart?.toString())
        setMinTempCurrency(
          separatorThousand(funnelQuery.mileageStart?.toString()),
        )
      }
    }
  }, [isResetFilter, isApplied, isButtonClick])

  const onInputEmpty = () => {
    if (minTempCurrency === '') {
      setMinTempCurrency(separatorThousand(minDefault))
      setMinMileageFilter(filterNonDigitCharacters(minDefault.toString()))
      setMinTemp(Number(filterNonDigitCharacters(minDefault.toString())))
      setIsErrorMin(false)
    }
    if (maxTempCurrency === '') {
      setMaxTempCurrency(separatorThousand(maxDefault))
      setMaxMileageFilter(filterNonDigitCharacters(maxDefault.toString()))
      setMaxTemp(Number(filterNonDigitCharacters(maxDefault.toString())))
      setIsErrorMax(false)
    }
    if (isErrorMin) {
      setTimeout(() => {
        setMinTempCurrency(separatorThousand(minDefault))
        setMinMileageFilter(filterNonDigitCharacters(minDefault.toString()))
        setMinTemp(Number(filterNonDigitCharacters(minDefault.toString())))
        setIsErrorMin(false)
      }, 2000)
    }
    if (isErrorMinTwo) {
      setTimeout(() => {
        setMinTempCurrency(separatorThousand(minDefault))
        setMinMileageFilter(filterNonDigitCharacters(minDefault.toString()))
        setMinTemp(Number(filterNonDigitCharacters(minDefault.toString())))
        setIsErrorMinTwo(false)
        setIsErrorForm(false)
      }, 2000)
    }
    if (isErrorMax) {
      setTimeout(() => {
        setMaxTempCurrency(separatorThousand(maxDefault))
        setMaxMileageFilter(filterNonDigitCharacters(maxDefault.toString()))
        setMaxTemp(Number(filterNonDigitCharacters(maxDefault.toString())))
        setIsErrorMax(false)
      }, 2000)
    }
    if (isErrorMaxTwo) {
      setTimeout(() => {
        setMaxTempCurrency(separatorThousand(maxDefault))
        setMaxMileageFilter(filterNonDigitCharacters(maxDefault.toString()))
        setMaxTemp(Number(filterNonDigitCharacters(maxDefault.toString())))
        setIsErrorMaxTwo(false)
        setIsErrorForm(false)
      }, 2000)
    }
  }
  useEffect(() => {
    setMinMileageFilter(
      funnelQuery.mileageStart
        ? funnelQuery.mileageStart.toString()
        : minMaxMileage.minMileageValue,
    )
    setMaxMileageFilter(
      funnelQuery.mileageEnd
        ? funnelQuery.mileageEnd.toString()
        : minMaxMileage.maxMileageValue,
    )
  }, [])
  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.container}>
          <div className={styles.wrapperHeader}>
            <div className={styles.textTitle}>Minimum</div>
          </div>
          <Input
            maxLength={15}
            defaultValue={minTempCurrency ? minTempCurrency : minTempCurrency}
            onChange={onChangeInputMinimum}
            className={
              !isErrorMin && !isErrorMinTwo
                ? styles.inputStyle
                : styles.inputStyleError
            }
            value={minTempCurrency ? minTempCurrency : minTempCurrency}
            type="tel"
            onBlur={onInputEmpty}
          />
          <div className={styles.errorMessage}>
            {isErrorMin && (
              <span className={styles.errorText}>Kilometer terlalu rendah</span>
            )}
            {!isErrorMin && isErrorMinTwo && (
              <span className={styles.errorText}>
                Kilometer harus lebih kecil
              </span>
            )}
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.wrapperHeader}>
            <div className={styles.textTitle}>Maksimum</div>
          </div>
          <Input
            maxLength={15}
            defaultValue={maxTempCurrency ? maxTempCurrency : maxTempCurrency}
            value={maxTempCurrency ? maxTempCurrency : maxTempCurrency}
            onChange={onChangeInputMaximum}
            className={
              !isErrorMax && !isErrorMaxTwo
                ? styles.inputStyle
                : styles.inputStyleError
            }
            type="tel"
            onBlur={onInputEmpty}
          />
          <div className={styles.errorMessage}>
            {isErrorMax && (
              <span className={styles.errorText}>Kilometer terlalu tinggi</span>
            )}
            {!isErrorMax && isErrorMaxTwo && (
              <span className={styles.errorText}>
                Kilometer harus lebih besar
              </span>
            )}
          </div>
        </div>
      </div>
      <div className={styles.errorContainer}></div>
      <div
        className={
          isErrorMinTwo || isErrorMaxTwo || isErrorMin || isErrorMax
            ? `${styles.errorForm} ${styles.errorFormCircle}`
            : ''
        }
      >
        <div className={styles.slider}>
          <Slider
            range
            min={minDefault}
            max={maxDefault}
            step={10}
            onChange={onChangeSlider}
            defaultValue={[minTemp || minDefault, maxTemp || maxDefault]}
            value={[minTemp || minDefault, maxTemp || maxDefault]}
          />
        </div>
      </div>
      <div className={styles.textWrapperSlider}>
        <div className={styles.left}>
          {addSeparator(minDefault.toString())}km
        </div>
        <div className={styles.right}>
          {addSeparator(maxDefault.toString())}km
        </div>
      </div>
    </>
  )
}
