import { useContext } from 'react'
import { CarModelDetailsResponse } from 'utils/types/utils'
import createDataContext from '../createDataContext'

const { Context, Provider } = createDataContext<
  CarModelDetailsResponse | undefined
>(undefined)

export const CarModelDetailsContextProvider: any = Provider

export const useContextCarModelDetails = () => {
  const { state, setState } = useContext(Context)
  return {
    carModelDetails: state,
    setCarModelDetails: setState,
  }
}
