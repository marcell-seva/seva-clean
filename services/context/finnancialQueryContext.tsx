import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { LocalStorageKey } from 'utils/enum'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { FinancialQuery } from 'utils/types/props'

enum PaymentType {
  MonthlyInstallment = 'monthlyInstallment',
  DownPayment = 'downPayment',
  CarModel = 'carModel',
}

enum DownPaymentType {
  DownPaymentAmount = 'amount',
  DownPaymentPercentage = 'percentage',
}

const initData = {
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

export type FinancialQueryContextType = {
  financialQuery: FinancialQuery
  fincap: boolean
  setFinancialQueryValue: (data: FinancialQuery) => void
  patchFinancialQuery: (data: FinancialQuery) => void
  clearQueryFilter: (data: FinancialQuery) => void
}

export const FinancialQueryContext = createContext<
  FinancialQueryContextType | []
>([])

export const FinancialQueryContextProvider = ({ children }: any) => {
  const [isInit, setIsInit] = useState<boolean>(true)
  const [storedValue] = useLocalStorage<FinancialQuery>(
    LocalStorageKey.FinancialData,
    initData,
  )
  const [financialQuery, setFinancialQuery] = useState<FinancialQuery>(initData)

  const fincap = useMemo(() => {
    if (
      financialQuery.age &&
      financialQuery.monthlyIncome &&
      financialQuery.tenure &&
      financialQuery.downPaymentAmount
    )
      return true
    return false
  }, [financialQuery])

  const setFinancialQueryValue = (value: FinancialQuery) => {
    setFinancialQuery({ ...financialQuery, ...value })

    const prevValue = localStorage.getItem(LocalStorageKey.FinancialData)
    const prevValueParse = JSON.parse(String(prevValue)) || ''

    const updateValue = { ...prevValueParse, ...value }
    localStorage.setItem(
      LocalStorageKey.FinancialData,
      JSON.stringify(updateValue),
    )
  }

  const patchFinancialQuery = (value: FinancialQuery) => {
    setFinancialQuery({ ...financialQuery, ...value })

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
    setFinancialQuery(initial)
    localStorage.setItem(LocalStorageKey.FinancialData, JSON.stringify(initial))
  }

  const checkIsInit = (): boolean => {
    const init = JSON.stringify(financialQuery)
    const newData = JSON.stringify(storedValue)
    const result = init === newData
    if (!result) setIsInit(false)
    return result
  }

  useEffect(() => {
    const onload = () => {
      setFinancialQuery(storedValue)
    }
    window.addEventListener('load', onload)
    return () => {
      window.removeEventListener('load', onload)
    }
  }, [])

  useEffect(() => {
    checkIsInit()
    if (!isInit) {
      const temp = { ...financialQuery, ...storedValue }
      setFinancialQuery(temp)
      // set localStorage so that it will be the same with context state using the updated data
      localStorage.setItem(LocalStorageKey.FinancialData, JSON.stringify(temp))
    }
  }, [isInit])

  return (
    <FinancialQueryContext.Provider
      value={{
        financialQuery,
        fincap,
        setFinancialQueryValue,
        patchFinancialQuery,
        clearQueryFilter,
      }}
    >
      {children}
    </FinancialQueryContext.Provider>
  )
}

export const useFinancialQueryData = () =>
  useContext(FinancialQueryContext) as FinancialQueryContextType
