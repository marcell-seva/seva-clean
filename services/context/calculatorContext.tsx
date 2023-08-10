import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react'
import { SpecialRateList } from 'utils/types'

export type CalculatorContextType = {
  specialRateResults: SpecialRateList[] | undefined
  setSpecialRateResults: Dispatch<SetStateAction<SpecialRateList[] | undefined>>
}

const CalculatorContext = createContext<CalculatorContextType>({
  specialRateResults: undefined,
  setSpecialRateResults: () => {},
})

export const CalculatorProvider = ({ children }: any) => {
  const [specialRateResults, setSpecialRateResults] = useState<
    SpecialRateList[] | undefined
  >(undefined)

  return (
    <CalculatorContext.Provider
      value={{
        specialRateResults,
        setSpecialRateResults,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  )
}

export const useContextCalculator = () => useContext(CalculatorContext)
