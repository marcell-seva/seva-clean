import React, { ChangeEvent, useEffect, useState } from 'react'
import styles from '../../../../styles/components/molecules/form/formYear.module.scss'
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
      ? funnelQuery.mileageStart?.toString()
      : minMaxMileage.minMileageValue,
  )
  const [maxTempCurrency, setMaxTempCurrency] = useState(
    funnelQuery.mileageEnd
      ? funnelQuery.mileageEnd?.toString()
      : minMaxMileage.maxMileageValue,
  )

  const onChangeInputMinimum = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value[0] === '0') {
      return
    }
    if (
      Number(filterNonDigitCharacters(event.target.value)) < minDefault &&
      event.target.value
    ) {
      setIsErrorMin(true)
    } else {
      setIsErrorMin(false)
    }
    if (Number(filterNonDigitCharacters(event.target.value)) > maxTemp) {
      setIsErrorMinTwo(true)
      setIsErrorForm(true)
    } else {
      setIsErrorMinTwo(false)
      setIsErrorForm(false)
    }
    setIsErrorMaxTwo(false)
    setMinTempCurrency(event.target.value)
    setMinMileageFilter(filterNonDigitCharacters(event.target.value))
    setMinTemp(Number(filterNonDigitCharacters(event.target.value)))
    return
  }
  const onChangeInputMaximum = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value[0] === '0') {
      return
    }
    if (
      Number(filterNonDigitCharacters(event.target.value)) > maxDefault &&
      event.target.value
    ) {
      setIsErrorMax(true)
    } else {
      setIsErrorMax(false)
    }
    if (Number(filterNonDigitCharacters(event.target.value)) < minTemp) {
      setIsErrorMaxTwo(true)
      setIsErrorForm(true)
    } else {
      setIsErrorForm(false)
      setIsErrorMaxTwo(false)
    }
    setIsErrorMinTwo(false)
    setMaxMileageFilter(filterNonDigitCharacters(event.target.value))
    setMaxTempCurrency(event.target.value)
    setMaxTemp(Number(filterNonDigitCharacters(event.target.value)))
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
        setMaxTempCurrency(funnelQuery.mileageEnd?.toString())
      }
      if (minTemp === minMaxMileage.minMileageValue) {
        setMinTemp(funnelQuery.mileageStart?.toString())
        setMinTempCurrency(funnelQuery.mileageStart?.toString())
      }
    }
  }, [isResetFilter, isApplied, isButtonClick])

  const onInputEmpty = () => {
    if (minTempCurrency === '') {
      setMinTempCurrency(minDefault)
      setMinMileageFilter(filterNonDigitCharacters(minDefault.toString()))
      setMinTemp(Number(filterNonDigitCharacters(minDefault.toString())))
      setIsErrorMin(false)
    }
    if (maxTempCurrency === '') {
      setMaxTempCurrency(maxDefault)
      setMaxMileageFilter(filterNonDigitCharacters(maxDefault.toString()))
      setMaxTemp(Number(filterNonDigitCharacters(maxDefault.toString())))
      setIsErrorMax(false)
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
              <span className={styles.errorText}>Tahun terlalu rendah</span>
            )}
            {!isErrorMin && isErrorMinTwo && (
              <span className={styles.errorText}>Tahun harus lebih kecil</span>
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
              <span className={styles.errorText}>Tahun terlalu tinggi</span>
            )}
            {!isErrorMax && isErrorMaxTwo && (
              <span className={styles.errorText}>Tahun harus lebih besar</span>
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
