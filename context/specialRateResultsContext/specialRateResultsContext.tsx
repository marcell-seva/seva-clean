import { useContext } from 'react'
import createDataContext from '../createDataContext'
import { SpecialRateList } from 'utils/types'

const { Context, Provider } = createDataContext<SpecialRateList[] | undefined>(
  undefined,
)

export const SpecialRateListResultsContextProvider = Provider

export const useContextSpecialRateResults = () => {
  const { state, setState } = useContext(Context)
  return {
    specialRateResults: state,
    setSpecialRateResults: setState,
  }
}
