import { useContext, useEffect, useState } from 'react'
import patchDataContext from '../patchDataContext/patchDataContext'
import { useLocalStorage } from 'utils/hooks/useLocalStorage/useLocalStorage'
import { DownPaymentType, LocalStorageKey, PaymentType } from 'utils/enum'
import { FunnelQuery } from 'utils/types/context'

export const initData = {
  paymentType: PaymentType.CarModel
    ? PaymentType.CarModel
    : PaymentType.DownPayment,
  downPaymentType: DownPaymentType.DownPaymentAmount,
  monthlyInstallment: '',
  downPaymentAmount: '',
  downPaymentPercentage: '',
  brand: [],
  bodyType: [],
  category: [],
  minPrice: '',
  maxPrice: '',
  priceRangeGroup: '',
  sortBy: 'lowToHigh',
  carModel: '',
  tenure: 5,
  age: '',
  monthlyIncome: '',
  isDefaultTenureChanged: false,
}

const { Context, Provider } = patchDataContext<FunnelQuery>(initData)

export const FunnelQueryContextProvider = Provider
export const useFunnelQueryData = () => {
  const [isInit, setIsInit] = useState<boolean>(true)
  const [storedValue] = useLocalStorage<FunnelQuery>(
    LocalStorageKey.CarFilter,
    initData,
  )
  const { state, setState } = useContext(Context)

  const setFunnelQueryValue = (value: FunnelQuery) => {
    setState({ ...state, ...value })

    const prevValue = localStorage.getItem(LocalStorageKey.CarFilter)
    const prevValueParse = JSON.parse(String(prevValue)) || ''

    const updateValue = { ...prevValueParse, ...value }
    localStorage.setItem(LocalStorageKey.CarFilter, JSON.stringify(updateValue))
  }

  const patchQueryFilter = (value: FunnelQuery) => {
    setState({ ...state, ...value })

    const prevValue = localStorage.getItem(LocalStorageKey.CarFilter)
    const prevValueParse = JSON.parse(String(prevValue)) || ''

    const updateValue = { ...prevValueParse, ...value }
    localStorage.setItem(LocalStorageKey.CarFilter, JSON.stringify(updateValue))
  }

  const clearQueryFilter = () => {
    const initial = {
      paymentType: PaymentType.CarModel
        ? PaymentType.CarModel
        : PaymentType.DownPayment,
      downPaymentType: DownPaymentType.DownPaymentAmount,
      monthlyInstallment: '',
      downPaymentAmount: '',
      downPaymentPercentage: '',
      brand: [],
      bodyType: [],
      category: [],
      minPrice: '',
      maxPrice: '',
      priceRangeGroup: '',
      sortBy: 'lowToHigh',
      carModel: '',
      tenure: 5,
      monthlyIncome: '',
    }
    setState(initial)
    localStorage.setItem(LocalStorageKey.CarFilter, JSON.stringify(initial))
  }

  useEffect(() => {
    const onload = () => {
      setState(storedValue)
    }

    window.addEventListener('load', onload)

    return () => {
      window.removeEventListener('load', onload)
    }
  }, [])

  const checkIsInit = (): boolean => {
    const init = JSON.stringify(state)
    const newData = JSON.stringify(storedValue)
    const result = init === newData
    if (!result) setIsInit(false)
    return result
  }

  useEffect(() => {
    checkIsInit()
    if (!isInit) {
      const temp = { ...state, ...storedValue }
      setState(temp)
      // set localStorage so that it will be the same with context state using the updated data
      localStorage.setItem(LocalStorageKey.CarFilter, JSON.stringify(temp))
    }
  }, [isInit])

  return {
    funnelQuery: state,
    setFunnelQuery: setFunnelQueryValue,
    patchFunnelQuery: patchQueryFilter,
    clearFunnelQuery: clearQueryFilter,
  }
}
