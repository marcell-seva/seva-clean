import React, { ChangeEvent, useContext, useEffect, useState } from 'react'
import styles from '/styles/components/molecules/form/formPrice.module.scss'
import stylec from '/styles/components/molecules/searchWidget/priceRangeWidget.module.scss'
import Input from 'antd/lib/input'
import Slider from 'antd/lib/slider'
import { Currency } from 'utils/handler/calculation'
import { filterNonDigitCharacters } from 'utils/handler/stringManipulation'
import { Button } from 'components/atoms'
import elementId from 'utils/helpers/trackerId'
import { SearchWidgetContext, SearchWidgetContextType } from 'services/context'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'

interface PriceRangeWidgetProps {
  onClose: () => void
  limitPrice: { min: number; max: number }
  trackCountlyOnSubmit?: (min: number, max: number) => void
  trackCountlyOnReset?: () => void
}

const PriceRangeWidget = ({
  limitPrice,
  onClose,
  trackCountlyOnSubmit,
  trackCountlyOnReset,
}: PriceRangeWidgetProps) => {
  const overMaxWarning = 'Harga yang kamu masukkan terlalu tinggi'
  const underMinWarning = 'Harga yang kamu masukkan terlalu rendah'
  const overMaxTwoWarning = 'Harga harus lebih kecil dari harga maksimum'
  const underMinTwoWarning = 'Harga harus lebih besar dari harga minimum'
  const { funnelWidget, saveFunnelWidget } = useContext(
    SearchWidgetContext,
  ) as SearchWidgetContextType
  const initErrorField = { min: false, max: false }
  const [errorMinField, setErrorMinField] = useState(initErrorField)
  const [errorMaxField, setErrorMaxField] = useState(initErrorField)
  const [errorMinTwoField, setErrorMinTwoField] = useState(false)
  const [errorMaxTwoField, setErrorMaxTwoField] = useState(false)
  const [disableActionButton, setDisableActionButton] = useState(true)
  const currentMinPrice =
    Number(funnelWidget.priceRangeGroup?.split('-')[0]) || 0
  const currentMaxPrice =
    Number(funnelWidget.priceRangeGroup?.split('-')[1]) || 0
  const initRawPrice = {
    min: currentMinPrice || limitPrice.min,
    max: currentMaxPrice || limitPrice.max,
  }
  const initMinMaxPrice = {
    min: Currency(initRawPrice.min),
    max: Currency(initRawPrice.max),
  }
  const [price, setPrice] = useState(initMinMaxPrice)
  const [rawPrice, setRawPrice] = useState(initRawPrice)

  const patchPrice = (type: 'min' | 'max', value: number) => {
    setPrice((prev) => ({
      ...prev,
      [type]: value === 0 ? '' : Currency(value),
    }))
    setRawPrice((prev) => ({ ...prev, [type]: value }))
  }

  const onChangeInputMinimum = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value[0] === '0') return patchPrice('min', 0)

    const unformanttedValue = Number(
      filterNonDigitCharacters(event.target.value),
    )

    const showError =
      unformanttedValue < limitPrice.min && event.target.value ? true : false
    setErrorMinField((prev) => ({ ...prev, min: showError }))
    setErrorMaxTwoField(false)

    if (unformanttedValue > rawPrice.max) {
      setErrorMinTwoField(true)
    } else {
      setErrorMinTwoField(false)
    }
    patchPrice('min', unformanttedValue)
  }

  const onChangeInputMaximum = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value[0] === '0') return patchPrice('max', 0)

    const unformanttedValue = Number(
      filterNonDigitCharacters(event.target.value),
    )
    const showError =
      unformanttedValue > limitPrice.max && event.target.value ? true : false
    setErrorMaxField((prev) => ({ ...prev, max: showError }))
    setErrorMinTwoField(false)

    if (unformanttedValue < rawPrice.min) {
      setErrorMaxTwoField(true)
    } else {
      setErrorMaxTwoField(false)
    }
    patchPrice('max', unformanttedValue)
  }

  const onInputEmpty = () => {
    if (rawPrice.min === 0) {
      patchPrice('min', limitPrice.min)
    } else if (rawPrice.max === 0) {
      patchPrice('max', limitPrice.max)
    }
  }

  const onChangeSlider = (newValue: number[]) => {
    setRawPrice({ min: newValue[0], max: newValue[1] })
    setPrice({ min: Currency(newValue[0]), max: Currency(newValue[1]) })
    if (newValue[0] > limitPrice.min) {
      setErrorMinField((prev) => ({ ...prev, min: false }))
      setErrorMinTwoField(false)
    }
    if (newValue[1] < limitPrice.max) {
      setErrorMaxField((prev) => ({ ...prev, max: false }))
      setErrorMaxTwoField(false)
    }
  }

  const clear = () => {
    trackCountlyOnReset && trackCountlyOnReset()
    setErrorMinField(initErrorField)
    setErrorMaxField(initErrorField)
    setErrorMinTwoField(false)
    setErrorMaxTwoField(false)
    setPrice({ min: Currency(limitPrice.min), max: Currency(limitPrice.max) })
    setRawPrice(limitPrice)
  }

  const submit = () => {
    trackCountlyOnSubmit && trackCountlyOnSubmit(rawPrice.min, rawPrice.max)
    saveFunnelWidget({
      ...funnelWidget,
      priceRangeGroup: `${rawPrice.min}-${rawPrice.max}`,
    })
    onClose()
  }

  useEffect(() => {
    if (funnelWidget.priceRangeGroup) {
      setDisableActionButton(
        rawPrice.max === 0 || rawPrice.min === 0 || rawPrice.max < rawPrice.min,
      )
    } else {
      setDisableActionButton(
        rawPrice.max === 0 ||
          rawPrice.min === 0 ||
          rawPrice.max < rawPrice.min ||
          (rawPrice.max === limitPrice.max && rawPrice.min === limitPrice.min),
      )
    }

    setErrorMinField({
      max: rawPrice.min > limitPrice.max,
      min: rawPrice.min < limitPrice.min,
    })
    setErrorMaxField({
      max: rawPrice.max > limitPrice.max,
      min: rawPrice.max < limitPrice.min,
    })
  }, [rawPrice])

  return (
    <>
      <div className={`${styles.container} price-input`}>
        <div className={styles.wrapperHeader}>
          <div className={styles.textTitle}>Minimum Harga</div>
        </div>
        <Input
          maxLength={15}
          type="tel"
          defaultValue={price.min ? 'Rp' + price.min : price.min}
          onChange={onChangeInputMinimum}
          className={
            errorMinField.min || errorMinField.max || errorMinTwoField
              ? styles.inputStyleError
              : styles.inputStyle
          }
          value={price.min ? 'Rp' + price.min : price.min}
          onBlur={onInputEmpty}
          data-testid={elementId.FieldMinPrice}
        />
      </div>
      {(errorMinField.min || errorMinField.max) && !errorMinTwoField && (
        <span className={styles.errorText}>
          {errorMinField.min
            ? underMinWarning
            : errorMinField.max
            ? overMaxWarning
            : ''}
        </span>
      )}
      {(!errorMinField.min || !errorMinField.max) && errorMinTwoField && (
        <span className={styles.errorText}>{overMaxTwoWarning}</span>
      )}
      <div className={styles.container}>
        <div className={styles.wrapperHeader}>
          <div className={styles.textTitle}>Maksimum Harga</div>
        </div>
        <Input
          maxLength={15}
          type="tel"
          defaultValue={price.max ? 'Rp' + price.max : price.max}
          value={price.max ? 'Rp' + price.max : price.max}
          onChange={onChangeInputMaximum}
          className={
            errorMaxField.max || errorMaxField.min || errorMaxTwoField
              ? styles.inputStyleError
              : styles.inputStyle
          }
          onBlur={onInputEmpty}
          data-testid={elementId.FieldMaxPrice}
        />
      </div>
      {(errorMaxField.max || errorMaxField.min) && !errorMaxTwoField && (
        <span className={styles.errorText}>
          {errorMaxField.min
            ? underMinWarning
            : errorMaxField.max
            ? overMaxWarning
            : ''}
        </span>
      )}
      {(!errorMaxField.min || !errorMaxField.max) && errorMaxTwoField && (
        <span className={styles.errorText}>{underMinTwoWarning}</span>
      )}
      <div
        className={
          errorMaxField.max ||
          errorMaxField.min ||
          errorMinField.max ||
          errorMinField.min ||
          errorMinTwoField ||
          errorMaxTwoField
            ? `${styles.errorForm} ${styles.errorFormCircle}`
            : ''
        }
      >
        <div className={styles.slider}>
          <Slider
            range
            min={limitPrice.min}
            max={limitPrice.max}
            step={1000000}
            onChange={onChangeSlider}
            defaultValue={[
              rawPrice.min || limitPrice.min,
              rawPrice.max || limitPrice.max,
            ]}
            value={[
              rawPrice.min || limitPrice.min,
              rawPrice.max || limitPrice.max,
            ]}
          />
        </div>
      </div>
      <div className={styles.textWrapperSlider}>
        <div className={styles.left}>Rp{Currency(String(limitPrice.min))}</div>
        <div className={styles.right}>Rp{Currency(String(limitPrice.max))}</div>
      </div>
      <div className={stylec.actionButtonWrapper}>
        <Button
          version={ButtonVersion.Secondary}
          size={ButtonSize.Big}
          disabled={
            errorMaxField.max ||
            errorMaxField.min ||
            errorMinField.max ||
            errorMinField.min ||
            errorMinTwoField ||
            errorMaxTwoField ||
            disableActionButton
          }
          onClick={clear}
          data-testid={elementId.FilterButton.Reset}
        >
          Atur Ulang
        </Button>
        <Button
          version={ButtonVersion.PrimaryDarkBlue}
          size={ButtonSize.Big}
          disabled={
            errorMaxField.max ||
            errorMaxField.min ||
            errorMinField.max ||
            errorMinField.min ||
            errorMinTwoField ||
            errorMaxTwoField ||
            disableActionButton
          }
          onClick={submit}
          data-testid={elementId.FilterButton.Submit}
        >
          Terapkan
        </Button>
      </div>
    </>
  )
}

export default PriceRangeWidget
