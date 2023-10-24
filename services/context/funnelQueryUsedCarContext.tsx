import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { LocalStorageKey } from 'utils/enum'
import { FunnelQuery } from 'utils/types/context'

const initData = {
  brand: [],
  bodyType: [],
  category: [],
  minPrice: '',
  maxPrice: '',
  minYear: '',
  maxYear: '',
  minMileage: '',
  maxMileage: '',
  yearStart: '',
  yearEnd: '',
  mileageStart: '',
  mileageEnd: '',
  transmission: [],
  cityId: [],
  priceRangeGroup: '',
  sortBy: 'lowToHigh',
  carModel: '',
  tenure: 5,
  age: '',
  monthlyIncome: '',
  isDefaultTenureChanged: false,
  filterFincap: false,
}

export type FunnelQueryUsedCarContextType = {
  funnelQuery: FunnelQuery
  setFunnelQueryValue: (data: FunnelQuery) => void
  patchFunnelQuery: (data: FunnelQuery) => void
  clearQueryFilter: () => void
}

export const FunnelQueryUsedCarContext = createContext<
  FunnelQueryUsedCarContextType | []
>([])

export const FunnelQueryUsedCarContextProvider = ({ children }: any) => {
  const [isInit, setIsInit] = useState<boolean>(true)
  const [storedValue] = useLocalStorage<FunnelQuery>(
    LocalStorageKey.UsedCarFilter,
    initData,
  )
  const [funnelQuery, setFunnelQuery] = useState<FunnelQuery>(initData)

  const setFunnelQueryValue = (value: FunnelQuery) => {
    setFunnelQuery({ ...funnelQuery, ...value })

    const prevValue = localStorage.getItem(LocalStorageKey.UsedCarFilter)
    const prevValueParse = JSON.parse(String(prevValue)) || ''

    const updateValue = { ...prevValueParse, ...value }
    localStorage.setItem(
      LocalStorageKey.UsedCarFilter,
      JSON.stringify(updateValue),
    )
  }

  const patchFunnelQuery = (value: FunnelQuery) => {
    setFunnelQuery({ ...funnelQuery, ...value })

    const prevValue = localStorage.getItem(LocalStorageKey.UsedCarFilter)
    const prevValueParse = JSON.parse(String(prevValue)) || ''

    const updateValue = { ...prevValueParse, ...value }
    localStorage.setItem(
      LocalStorageKey.UsedCarFilter,
      JSON.stringify(updateValue),
    )
  }

  const clearQueryFilter = () => {
    const initial = {
      brand: [],
      bodyType: [],
      category: [],
      minPrice: '',
      maxPrice: '',
      minYear: '',
      maxYear: '',
      minMileage: '',
      maxMileage: '',
      yearStart: '',
      yearEnd: '',
      mileageStart: '',
      mileageEnd: '',
      transmission: [],
      cityId: [],
      priceStart: '',
      priceEnd: '',
      sortBy: 'lowToHigh',
      carModel: '',
      tenure: 5,
      monthlyIncome: '',
      filterFincap: false,
    }
    setFunnelQuery(initial)
    localStorage.setItem(LocalStorageKey.UsedCarFilter, JSON.stringify(initial))
  }

  const checkIsInit = (): boolean => {
    const init = JSON.stringify(funnelQuery)
    const newData = JSON.stringify(storedValue)
    const result = init === newData
    if (!result) setIsInit(false)
    return result
  }

  useEffect(() => {
    const onload = () => {
      setFunnelQuery(storedValue)
    }
    window.addEventListener('load', onload)
    return () => {
      window.removeEventListener('load', onload)
    }
  }, [])

  useEffect(() => {
    checkIsInit()
    if (!isInit) {
      const temp = { ...funnelQuery, ...storedValue }
      setFunnelQuery(temp)
      // set localStorage so that it will be the same with context state using the updated data
      localStorage.setItem(LocalStorageKey.UsedCarFilter, JSON.stringify(temp))
    }
  }, [isInit])

  return (
    <FunnelQueryUsedCarContext.Provider
      value={{
        funnelQuery,
        setFunnelQueryValue,
        patchFunnelQuery,
        clearQueryFilter,
      }}
    >
      {children}
    </FunnelQueryUsedCarContext.Provider>
  )
}

export const useFunnelQueryUsedCarData = () =>
  useContext(FunnelQueryUsedCarContext) as FunnelQueryUsedCarContextType
