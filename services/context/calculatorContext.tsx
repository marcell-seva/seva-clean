import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react'
import { SpecialRateList } from 'utils/types'
import { LoanCalculatorInsuranceAndPromoType } from 'utils/types/utils'

export type CalculatorContextType = {
  specialRateResults: SpecialRateList[] | undefined
  setSpecialRateResults: Dispatch<SetStateAction<SpecialRateList[] | undefined>>
  insuranceAndPromo: LoanCalculatorInsuranceAndPromoType[]
  setInsuranceAndPromo: Dispatch<
    SetStateAction<LoanCalculatorInsuranceAndPromoType[]>
  >
}

const CalculatorContext = createContext<CalculatorContextType>({
  specialRateResults: undefined,
  setSpecialRateResults: () => {},
  insuranceAndPromo: [],
  setInsuranceAndPromo: () => {},
})

export const CalculatorProvider = ({ children }: any) => {
  const [specialRateResults, setSpecialRateResults] = useState<
    SpecialRateList[] | undefined
  >(undefined)

  const [insuranceAndPromo, setInsuranceAndPromo] = useState<
    LoanCalculatorInsuranceAndPromoType[]
  >([])

  return (
    <CalculatorContext.Provider
      value={{
        specialRateResults,
        setSpecialRateResults,
        insuranceAndPromo,
        setInsuranceAndPromo,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  )
}

export const useContextCalculator = () => useContext(CalculatorContext)
