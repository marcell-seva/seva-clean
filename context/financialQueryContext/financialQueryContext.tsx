import { useContext, useEffect, useState } from 'react'
import { PaymentType, DownPaymentType, LocalStorageKey } from 'utils/enum'
import { useLocalStorage } from 'utils/hooks/useLocalStorage/useLocalStorage'
import { FormControlValue } from 'utils/types'
import patchDataContext from '../patchDataContext/patchDataContext'

export interface FinancialQuery {
  paymentType?: FormControlValue | string
  downPaymentType?: FormControlValue
  monthlyInstallment?: FormControlValue
  downPaymentAmount?: FormControlValue
  downPaymentPercentage?: FormControlValue
  brand?: string[]
  monthlyIncome?: FormControlValue
  age?: FormControlValue
  bodyType?: string[]
  category?: string[]
  minPrice?: FormControlValue
  maxPrice?: FormControlValue
  priceRangeGroup?: FormControlValue
  sortBy?: string | FormControlValue
  carModel?: FormControlValue
  phoneNumber?: string
  tenure?: string | number
  isDefaultTenureChanged?: boolean
}

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

const { Context, Provider } = patchDataContext<FinancialQuery>(initData)

export const FinancialQueryContextProvider = Provider
export const useFinancialQueryData = () => {
  const [isInit, setIsInit] = useState<boolean>(true)
  const [storedValue] = useLocalStorage<FinancialQuery>(
    LocalStorageKey.FinancialData,
    initData,
  )
  const { state, setState } = useContext(Context)

  const setFinancialQueryValue = (value: FinancialQuery) => {
    setState({ ...state, ...value })

    const prevValue = localStorage.getItem(LocalStorageKey.FinancialData)
    const prevValueParse = JSON.parse(String(prevValue)) || ''

    const updateValue = { ...prevValueParse, ...value }
    localStorage.setItem(
      LocalStorageKey.FinancialData,
      JSON.stringify(updateValue),
    )
  }

  const patchQueryFilter = (value: FinancialQuery) => {
    setState({ ...state, ...value })

    const prevValue = localStorage.getItem(LocalStorageKey.FinancialData)
    const prevValueParse = JSON.parse(String(prevValue)) || ''

    const updateValue = { ...prevValueParse, ...value }
    localStorage.setItem(
      LocalStorageKey.FinancialData,
      JSON.stringify(updateValue),
    )
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
    localStorage.setItem(LocalStorageKey.FinancialData, JSON.stringify(initial))
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
      localStorage.setItem(LocalStorageKey.FinancialData, JSON.stringify(temp))
    }
  }, [isInit])

  return {
    financialQuery: state,
    setFinancialQuery: setFinancialQueryValue,
    patchFinancialQuery: patchQueryFilter,
    clearFinancialQuery: clearQueryFilter,
  }
}
