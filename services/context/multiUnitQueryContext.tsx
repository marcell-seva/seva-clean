import { createContext, useContext, useState } from 'react'
import {
  MultKKCarRecommendation,
  SendMultiKualifikasiKreditResponse,
} from 'utils/types/utils'

export const initEmptyData = {
  priceRangeGroup: '',
  downPaymentAmount: '',
  tenure: '',
  monthlyIncome: '',
  transmission: [] as string[],
  occupation: '',
  cityName: '',
  dob: '',
  multikkResponse: {} as SendMultiKualifikasiKreditResponse,
  filteredCarList: [] as MultKKCarRecommendation[],
  trxCode: '',
}

export type MultiUnitQueryContextType = {
  multiUnitQuery: typeof initEmptyData
  setMultiUnitQuery: (data: typeof initEmptyData) => void
}

export const MultiUnitQueryContext = createContext<MultiUnitQueryContextType>({
  multiUnitQuery: initEmptyData,
  setMultiUnitQuery: () => {},
})

export const MultiUnitQueryContextProvider = ({ children }: any) => {
  const [multiUnitQuery, setMultiUnitQuery] =
    useState<typeof initEmptyData>(initEmptyData)

  return (
    <MultiUnitQueryContext.Provider
      value={{
        multiUnitQuery,
        setMultiUnitQuery,
      }}
    >
      {children}
    </MultiUnitQueryContext.Provider>
  )
}

export const useMultiUnitQueryContext = () =>
  useContext(MultiUnitQueryContext) as MultiUnitQueryContextType
