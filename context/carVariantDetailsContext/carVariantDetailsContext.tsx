import { useContext } from 'react'
import createDataContext from '../createDataContext'
import { CarVariantDetails } from 'utils/types/utils'

const { Context, Provider } = createDataContext<CarVariantDetails | undefined>(
  undefined,
)

export const CarVariantDetailsContextProvider = Provider

export const useContextCarVariantDetails = () => {
  const { state, setState } = useContext(Context)
  return {
    carVariantDetails: state,
    setCarVariantDetails: setState,
  }
}
