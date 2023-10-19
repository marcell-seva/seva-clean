import React, { ChangeEvent, useEffect, useState } from 'react'
import styles from '../../../../styles/components/molecules/form/formPrice.module.scss'
import { Input, Slider } from 'antd'
import { replacePriceSeparatorByLocalization } from 'utils/handler/rupiah'
import { filterNonDigitCharacters } from 'utils/stringUtils'
import { useFunnelQueryUsedCarData } from 'services/context/funnelQueryUsedCarContext'
import elementId from 'helpers/elementIds'
import { LanguageCode } from 'utils/enum'

type FormPriceUsedCarProps = {
  minMaxPrice?: any
  minPriceFilter?: any
  maxPriceFilter?: any
  setMinPriceFilter?: any
  setMaxPriceFilter?: any
  isResetFilter?: boolean
  setIsErrorForm?: any
  isApplied?: boolean
  isButtonClick: boolean
}
export const FormPriceUsedCar = ({
  minMaxPrice,
  setMinPriceFilter,
  setMaxPriceFilter,
  isResetFilter,
  setIsErrorForm,
  isApplied,
  isButtonClick,
}: FormPriceUsedCarProps) => {
  const { funnelQuery } = useFunnelQueryUsedCarData()
  const Currency = (value: any) => {
    return replacePriceSeparatorByLocalization(
      filterNonDigitCharacters(value.toString()),
      LanguageCode.id,
    )
  }
  const [minDefault] = useState(minMaxPrice.minPriceValue)
  const [maxDefault] = useState(minMaxPrice.maxPriceValue)
  const [minTemp, setMinTemp] = useState(
    funnelQuery.priceRangeGroup
      ? funnelQuery.priceRangeGroup?.toString().split('-')[0]
      : minMaxPrice.minPriceValue,
  )
  const [maxTemp, setMaxTemp] = useState(
    funnelQuery.priceRangeGroup
      ? funnelQuery.priceRangeGroup?.toString().split('-')[1]
      : minMaxPrice.maxPriceValue,
  )
  const [isErrorMin, setIsErrorMin] = useState(false)
  const [isErrorMax, setIsErrorMax] = useState(false)
  const [isErrorMinTwo, setIsErrorMinTwo] = useState(false)
  const [isErrorMaxTwo, setIsErrorMaxTwo] = useState(false)
  const [minTempCurrency, setMinTempCurrency] = useState(
    funnelQuery.priceRangeGroup
      ? Currency(funnelQuery.priceRangeGroup?.toString().split('-')[0])
      : Currency(minMaxPrice.minPriceValue),
  )
  const [maxTempCurrency, setMaxTempCurrency] = useState(
    funnelQuery.priceRangeGroup
      ? Currency(funnelQuery.priceRangeGroup?.toString().split('-')[1])
      : Currency(minMaxPrice.maxPriceValue),
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
    setMinTempCurrency(Currency(event.target.value))
    setMinPriceFilter(filterNonDigitCharacters(event.target.value))
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
    setMaxPriceFilter(filterNonDigitCharacters(event.target.value))
    setMaxTempCurrency(Currency(event.target.value))
    setMaxTemp(Number(filterNonDigitCharacters(event.target.value)))
    return
  }
  const onChangeSlider = (newValue: any) => {
    setMinTemp(newValue[0])
    setMinTempCurrency(Currency(newValue[0].toString()))
    setMinPriceFilter(newValue[0].toString())
    setMaxPriceFilter(newValue[1].toString())
    setMaxTemp(newValue[1])
    setMaxTempCurrency(Currency(newValue[1].toString()))
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
      setMinTemp(minMaxPrice.minPriceValue)
      setMaxTemp(minMaxPrice.maxPriceValue)
      setMinTempCurrency(Currency(minMaxPrice.minPriceValue))
      setMaxTempCurrency(Currency(minMaxPrice.maxPriceValue))
    }
    if (funnelQuery.priceRangeGroup && !isApplied) {
      if (maxTemp === minMaxPrice.maxPriceValue) {
        setMaxTemp(funnelQuery.priceRangeGroup?.toString().split('-')[1])
        setMaxTempCurrency(
          Currency(funnelQuery.priceRangeGroup?.toString().split('-')[1]),
        )
      }
      if (minTemp === minMaxPrice.minPriceValue) {
        setMinTemp(funnelQuery.priceRangeGroup?.toString().split('-')[0])
        setMinTempCurrency(
          Currency(funnelQuery.priceRangeGroup?.toString().split('-')[0]),
        )
      }
    }
  }, [isResetFilter, isApplied, isButtonClick])

  const onInputEmpty = () => {
    if (minTempCurrency === '') {
      setMinTempCurrency(Currency(minDefault))
      setMinPriceFilter(filterNonDigitCharacters(minDefault.toString()))
      setMinTemp(Number(filterNonDigitCharacters(minDefault.toString())))
      setIsErrorMin(false)
    }
    if (maxTempCurrency === '') {
      setMaxTempCurrency(Currency(maxDefault))
      setMaxPriceFilter(filterNonDigitCharacters(maxDefault.toString()))
      setMaxTemp(Number(filterNonDigitCharacters(maxDefault.toString())))
      setIsErrorMax(false)
    }
  }
  useEffect(() => {
    setMinPriceFilter(
      funnelQuery.priceRangeGroup
        ? funnelQuery.priceRangeGroup?.toString().split('-')[0]
        : minMaxPrice.minPriceValue,
    )
    setMaxPriceFilter(
      funnelQuery.priceRangeGroup
        ? funnelQuery.priceRangeGroup?.toString().split('-')[1]
        : minMaxPrice.maxPriceValue,
    )
  }, [])
  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapperHeader}>
          <div className={styles.textTitle}>Minimum Harga</div>
        </div>
        <Input
          maxLength={15}
          defaultValue={
            minTempCurrency ? 'Rp' + minTempCurrency : minTempCurrency
          }
          onChange={onChangeInputMinimum}
          className={
            !isErrorMin && !isErrorMinTwo
              ? styles.inputStyle
              : styles.inputStyleError
          }
          value={minTempCurrency ? 'Rp' + minTempCurrency : minTempCurrency}
          type="tel"
          onBlur={onInputEmpty}
          data-testid={elementId.FieldMinPrice}
        />
      </div>
      {isErrorMin && (
        <span className={styles.errorText}>
          Harga yang kamu masukkan terlalu rendah
        </span>
      )}
      {!isErrorMin && isErrorMinTwo && (
        <span className={styles.errorText}>
          Harga harus lebih kecil dari harga maksimum
        </span>
      )}
      <div className={styles.container}>
        <div className={styles.wrapperHeader}>
          <div className={styles.textTitle}>Maksimum Harga</div>
        </div>
        <Input
          maxLength={15}
          defaultValue={
            maxTempCurrency ? 'Rp' + maxTempCurrency : maxTempCurrency
          }
          value={maxTempCurrency ? 'Rp' + maxTempCurrency : maxTempCurrency}
          onChange={onChangeInputMaximum}
          className={
            !isErrorMax && !isErrorMaxTwo
              ? styles.inputStyle
              : styles.inputStyleError
          }
          type="tel"
          onBlur={onInputEmpty}
          data-testid={elementId.FieldMaxPrice}
        />
      </div>
      {isErrorMax && (
        <span className={styles.errorText}>
          Harga yang kamu masukkan terlalu tinggi
        </span>
      )}
      {!isErrorMax && isErrorMaxTwo && (
        <span className={styles.errorText}>
          Harga harus lebih besar dari harga minimum
        </span>
      )}
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
            step={1000000}
            onChange={onChangeSlider}
            defaultValue={[minTemp || minDefault, maxTemp || maxDefault]}
            value={[minTemp || minDefault, maxTemp || maxDefault]}
          />
        </div>
      </div>
      <div className={styles.textWrapperSlider}>
        <div className={styles.left}>Rp{Currency(minDefault)}</div>
        <div className={styles.right}>Rp{Currency(maxDefault)}</div>
      </div>
    </>
  )
}
