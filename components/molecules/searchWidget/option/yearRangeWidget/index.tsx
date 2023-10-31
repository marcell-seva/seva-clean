import React, { ChangeEvent, useContext, useEffect, useState } from 'react'
import styles from 'styles/components/molecules/form/formYear.module.scss'
import stylec from '/styles/components/molecules/searchWidget/priceRangeWidget.module.scss'
import Input from 'antd/lib/input'
import Slider from 'antd/lib/slider'
import { Currency } from 'utils/handler/calculation'
import { filterNonDigitCharacters } from 'utils/handler/stringManipulation'
import { Button } from 'components/atoms'
import elementId from 'utils/helpers/trackerId'
import {
  SearchUsedCarWidgetContext,
  SearchUsedCarWidgetContextType,
  SearchWidgetContext,
  SearchWidgetContextType,
} from 'services/context'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { useFunnelQueryUsedCarData } from 'services/context/funnelQueryUsedCarContext'

interface YearRangeWidgetProps {
  onClose: () => void
  minMaxYear?: any
}

const YearRangeWidget = ({ minMaxYear, onClose }: YearRangeWidgetProps) => {
  const overMaxWarning = 'Harga yang kamu masukkan terlalu tinggi'
  const underMinWarning = 'Harga yang kamu masukkan terlalu rendah'
  const overMaxTwoWarning = 'Harga harus lebih kecil dari harga maksimum'
  const underMinTwoWarning = 'Harga harus lebih besar dari harga minimum'
  const { funnelQuery } = useFunnelQueryUsedCarData()
  const { funnelWidget, saveFunnelWidget } = useContext(
    SearchUsedCarWidgetContext,
  ) as SearchUsedCarWidgetContextType
  const [minDefault] = useState(minMaxYear.minYears)
  const [maxDefault] = useState(minMaxYear.maxYears)
  const [minTemp, setMinTemp] = useState(
    funnelWidget.minYear ? funnelWidget.minYear : minDefault,
  )
  const [maxTemp, setMaxTemp] = useState(
    funnelWidget.maxYear ? funnelWidget.maxYear : maxDefault,
  )
  const [isFirstInit, setIsFirstInit] = useState(true)
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

  const [disableActionButton, setDisableActionButton] = useState(true)

  const onChangeInputMinimum = (event: ChangeEvent<HTMLInputElement>) => {
    setIsFirstInit(false)
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
    } else {
      setIsErrorMinTwo(false)
    }
    setIsErrorMaxTwo(false)
    setMinTempCurrency(numberOnly)

    setMinTemp(Number(filterNonDigitCharacters(numberOnly)))
    return
  }
  const onChangeInputMaximum = (event: ChangeEvent<HTMLInputElement>) => {
    setIsFirstInit(false)
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
    } else {
      setIsErrorMaxTwo(false)
    }
    setIsErrorMinTwo(false)
    setMaxTempCurrency(numberOnly)
    setMaxTemp(Number(filterNonDigitCharacters(numberOnly)))
    return
  }
  const onChangeSlider = (newValue: any) => {
    setMinTemp(newValue[0])
    setMinTempCurrency(newValue[0].toString())
    setMaxTemp(newValue[1])
    setMaxTempCurrency(newValue[1].toString())
    if (newValue[0] > minDefault) {
      setIsFirstInit(false)
      setIsErrorMin(false)
      setIsErrorMinTwo(false)
    }
    if (newValue[1] < maxDefault) {
      setIsFirstInit(false)
      setIsErrorMax(false)
      setIsErrorMaxTwo(false)
    }
    if (newValue[0] > minDefault && newValue[1] < maxDefault) {
      setIsFirstInit(false)
    }
  }

  const onInputEmpty = () => {
    if (minTempCurrency === '') {
      setMinTempCurrency(minDefault)

      setMinTemp(Number(filterNonDigitCharacters(minDefault.toString())))
      setIsErrorMin(false)
    }
    if (maxTempCurrency === '') {
      setMaxTempCurrency(maxDefault)

      setMaxTemp(Number(filterNonDigitCharacters(maxDefault.toString())))
      setIsErrorMax(false)
    }
    if (isErrorMin) {
      setTimeout(() => {
        setMinTempCurrency(minDefault)

        setMinTemp(Number(filterNonDigitCharacters(minDefault.toString())))
        setIsErrorMin(false)
      }, 2000)
    }
    if (isErrorMinTwo) {
      setTimeout(() => {
        setMinTempCurrency(minDefault)

        setMinTemp(Number(filterNonDigitCharacters(minDefault.toString())))
        setIsErrorMinTwo(false)
      }, 2000)
    }

    if (isErrorMax) {
      setTimeout(() => {
        setMaxTempCurrency(maxDefault)

        setMaxTemp(Number(filterNonDigitCharacters(maxDefault.toString())))
        setIsErrorMax(false)
      }, 2000)
    }
    if (isErrorMaxTwo) {
      setTimeout(() => {
        setMaxTempCurrency(maxDefault)

        setMaxTemp(Number(filterNonDigitCharacters(maxDefault.toString())))
        setIsErrorMaxTwo(false)
      }, 2000)
    }
  }

  const clear = () => {
    setIsErrorMin(false)
    setIsErrorMax(false)
    setIsErrorMinTwo(false)
    setIsErrorMaxTwo(false)
    setMinTemp(minDefault)
    setMaxTemp(maxDefault)
    setIsFirstInit(true)
  }

  const submit = () => {
    setIsFirstInit(false)
    saveFunnelWidget({
      ...funnelWidget,
      minYear: minTemp.toString(),
      maxYear: maxTemp.toString(),
    })
    onClose()
  }

  useEffect(() => {
    if (isFirstInit) {
      setDisableActionButton(isFirstInit)
    } else {
      setDisableActionButton(
        isErrorMinTwo || isErrorMin || isErrorMaxTwo || isErrorMax,
      )
    }
  }, [isErrorMinTwo, isErrorMaxTwo, isErrorMin, isErrorMax, isFirstInit])

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.container}>
          <div className={styles.wrapperHeader}>
            <div className={styles.textTitle}>Dari</div>
          </div>
          <Input
            maxLength={4}
            defaultValue={funnelWidget.minYear ? funnelWidget.minYear : minTemp}
            onChange={onChangeInputMinimum}
            className={
              !isErrorMin && !isErrorMinTwo
                ? styles.inputStyle
                : styles.inputStyleError
            }
            value={minTemp ? minTemp : minTemp}
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
            defaultValue={maxTemp ? maxTemp : maxTemp}
            value={maxTemp ? maxTemp : maxTemp}
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
      <div className={stylec.actionButtonWrapper}>
        <Button
          version={ButtonVersion.Secondary}
          size={ButtonSize.Big}
          disabled={disableActionButton}
          onClick={clear}
          data-testid={elementId.FilterButton.Reset}
        >
          Atur Ulang
        </Button>
        <Button
          version={ButtonVersion.PrimaryDarkBlue}
          size={ButtonSize.Big}
          disabled={disableActionButton}
          onClick={submit}
          data-testid={elementId.FilterButton.Submit}
        >
          Terapkan
        </Button>
      </div>
    </>
  )
}

export default YearRangeWidget
