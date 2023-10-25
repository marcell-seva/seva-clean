import React, { ChangeEvent, useEffect, useState } from 'react'
import styles from '../../../../styles/components/molecules/form/formYear.module.scss'
import { Input, Slider } from 'antd'
import { filterNonDigitCharacters } from 'utils/stringUtils'
import { useFunnelQueryUsedCarData } from 'services/context/funnelQueryUsedCarContext'
import elementId from 'helpers/elementIds'

type FormYearProps = {
  minMaxYear?: any
  minYearFilter?: any
  maxYearFilter?: any
  setMinYearFilter?: any
  setMaxYearFilter?: any
  isResetFilter?: boolean
  setIsErrorForm?: any
  isApplied?: boolean
  isButtonClick: boolean
}
export const FormYear = ({
  minMaxYear,
  setMinYearFilter,
  setMaxYearFilter,
  isResetFilter,
  setIsErrorForm,
  isApplied,
  isButtonClick,
}: FormYearProps) => {
  const { funnelQuery } = useFunnelQueryUsedCarData()

  const [minDefault] = useState(minMaxYear.minYearValue)
  const [maxDefault] = useState(minMaxYear.maxYearValue)
  const [minTemp, setMinTemp] = useState(
    funnelQuery.yearStart
      ? funnelQuery.yearStart?.toString()
      : minMaxYear.minYearValue,
  )
  const [maxTemp, setMaxTemp] = useState(
    funnelQuery.yearEnd
      ? funnelQuery.yearEnd?.toString()
      : minMaxYear.maxYearValue,
  )
  const [isErrorMin, setIsErrorMin] = useState(false)
  const [isErrorMax, setIsErrorMax] = useState(false)
  const [isErrorMinTwo, setIsErrorMinTwo] = useState(false)
  const [isErrorMaxTwo, setIsErrorMaxTwo] = useState(false)
  const [minTempCurrency, setMinTempCurrency] = useState(
    funnelQuery.yearStart
      ? funnelQuery.yearStart?.toString()
      : minMaxYear.minYearValue,
  )
  const [maxTempCurrency, setMaxTempCurrency] = useState(
    funnelQuery.yearEnd
      ? funnelQuery.yearEnd?.toString()
      : minMaxYear.maxYearValue,
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
    setMinYearFilter(filterNonDigitCharacters(event.target.value))
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
    setMaxYearFilter(filterNonDigitCharacters(event.target.value))
    setMaxTempCurrency(event.target.value)
    setMaxTemp(Number(filterNonDigitCharacters(event.target.value)))
    return
  }
  const onChangeSlider = (newValue: any) => {
    setMinTemp(newValue[0])
    setMinTempCurrency(newValue[0].toString())
    setMinYearFilter(newValue[0].toString())
    setMaxYearFilter(newValue[1].toString())
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
      setMinTemp(minMaxYear.minYearValue)
      setMaxTemp(minMaxYear.maxYearValue)
      setMinTempCurrency(minMaxYear.minYearValue)
      setMaxTempCurrency(minMaxYear.maxYearValue)
    }
    if (funnelQuery.yearStart && funnelQuery.yearEnd && !isApplied) {
      if (maxTemp === minMaxYear.maxYearValue) {
        setMaxTemp(funnelQuery.yearEnd?.toString())
        setMaxTempCurrency(funnelQuery.yearEnd?.toString())
      }
      if (minTemp === minMaxYear.minYearValue) {
        setMinTemp(funnelQuery.yearStart?.toString())
        setMinTempCurrency(funnelQuery.yearStart?.toString())
      }
    }
  }, [isResetFilter, isApplied, isButtonClick])

  const onInputEmpty = () => {
    if (minTempCurrency === '') {
      setMinTempCurrency(minDefault)
      setMinYearFilter(filterNonDigitCharacters(minDefault.toString()))
      setMinTemp(Number(filterNonDigitCharacters(minDefault.toString())))
      setIsErrorMin(false)
    }
    if (maxTempCurrency === '') {
      setMaxTempCurrency(maxDefault)
      setMaxYearFilter(filterNonDigitCharacters(maxDefault.toString()))
      setMaxTemp(Number(filterNonDigitCharacters(maxDefault.toString())))
      setIsErrorMax(false)
    }
    if (isErrorMin) {
      setTimeout(() => {
        setMinTempCurrency(minDefault)
        setMinYearFilter(filterNonDigitCharacters(minDefault.toString()))
        setMinTemp(Number(filterNonDigitCharacters(minDefault.toString())))
        setIsErrorMin(false)
      }, 2000)
    }
    if (isErrorMinTwo) {
      setTimeout(() => {
        setMinTempCurrency(minDefault)
        setMinYearFilter(filterNonDigitCharacters(minDefault.toString()))
        setMinTemp(Number(filterNonDigitCharacters(minDefault.toString())))
        setIsErrorMinTwo(false)
      }, 2000)
    }

    if (isErrorMax) {
      setTimeout(() => {
        setMaxTempCurrency(maxDefault)
        setMaxYearFilter(filterNonDigitCharacters(maxDefault.toString()))
        setMaxTemp(Number(filterNonDigitCharacters(maxDefault.toString())))
        setIsErrorMax(false)
      }, 2000)
    }
    if (isErrorMaxTwo) {
      setTimeout(() => {
        setMaxTempCurrency(maxDefault)
        setMaxYearFilter(filterNonDigitCharacters(maxDefault.toString()))
        setMaxTemp(Number(filterNonDigitCharacters(maxDefault.toString())))
        setIsErrorMaxTwo(false)
      }, 2000)
    }
  }
  useEffect(() => {
    setMinYearFilter(
      funnelQuery.yearStart
        ? funnelQuery.yearStart?.toString()
        : minMaxYear.minYearValue,
    )
    setMaxYearFilter(
      funnelQuery.yearEnd
        ? funnelQuery.yearEnd?.toString()
        : minMaxYear.maxYearValue,
    )
  }, [])
  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.container}>
          <div className={styles.wrapperHeader}>
            <div className={styles.textTitle}>Dari</div>
          </div>
          <Input
            maxLength={4}
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
            tabIndex={-1}
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
            <div className={styles.textTitle}>Hingga</div>
          </div>
          <Input
            maxLength={4}
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
            tabIndex={-1}
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
            step={1}
            onChange={onChangeSlider}
            defaultValue={[minTemp || minDefault, maxTemp || maxDefault]}
            value={[minTemp || minDefault, maxTemp || maxDefault]}
            autoFocus={false}
          />
        </div>
      </div>
      <div className={styles.textWrapperSlider}>
        <div className={styles.left}>{minDefault}</div>
        <div className={styles.right}>{maxDefault}</div>
      </div>
    </>
  )
}
