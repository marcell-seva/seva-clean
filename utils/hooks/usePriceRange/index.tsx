import { AxiosResponse } from 'axios'
import { ChangeEvent, useEffect, useState } from 'react'

import { Currency } from 'utils/handler/calculation'
import { filterNonDigitCharacters } from 'utils/stringUtils'
import { MinMaxPrice } from 'utils/types/props'
import { getCity } from '../useGetCity'
import { getMinMaxPrice } from 'services/api'

export const usePriceRange = () => {
  const initErrorField = { min: false, max: false }
  const initPrice = { min: 0, max: 0 }
  const [limitPrice, setLimitPrice] = useState(initPrice)
  const [rawPrice, setRawPrice] = useState(initPrice)
  const [price, setPrice] = useState({ min: '', max: '' })
  const [errorMinField, setErrorMinField] = useState(initErrorField)
  const [errorMaxField, setErrorMaxField] = useState(initErrorField)
  const [errorMinTwoField, setErrorMinTwoField] = useState(false)
  const [errorMaxTwoField, setErrorMaxTwoField] = useState(false)

  const fetchMinMaxPrice = () => {
    const params = new URLSearchParams()
    getCity().cityCode && params.append('city', getCity().cityCode as string)

    getMinMaxPrice('', { params }).then((response) => {
      setLimitPrice({
        min: response.minPriceValue,
        max: response.maxPriceValue,
      })
    })
  }

  const patchPrice = (type: 'min' | 'max', value: number) => {
    setPrice((prev) => ({
      ...prev,
      [type]: value === 0 ? '' : Currency(value),
    }))
    setRawPrice((prev) => ({ ...prev, [type]: value }))
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

  const onChangeInputMinimum = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value[0] === '0') return patchPrice('min', 0)

    const unformanttedValue = Number(
      filterNonDigitCharacters(event.target.value),
    )

    const showError =
      unformanttedValue &&
      unformanttedValue < limitPrice.min &&
      event.target.value
        ? true
        : false
    setErrorMinField((prev) => ({ ...prev, min: showError }))
    setErrorMaxTwoField(false)

    if (rawPrice.max && unformanttedValue > rawPrice.max) {
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

  useEffect(() => {
    fetchMinMaxPrice()
  }, [])

  return {
    price,
    limitPrice,
    rawPrice,
    errorMaxField,
    errorMinField,
    errorMinTwoField,
    errorMaxTwoField,
    onChangeSlider,
    onChangeInputMaximum,
    onChangeInputMinimum,
    onInputEmpty,
  }
}
