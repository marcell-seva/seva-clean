import { useContext } from 'react'
import { CarVariantDetails } from '../../utils/types'
import createDataContext from '../createDataContext'

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
