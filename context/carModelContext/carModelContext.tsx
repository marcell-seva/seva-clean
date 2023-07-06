import { useContext } from 'react'
import { CarModelResponse } from 'utils/types/carVariant'
import createDataContext from '../createDataContext'

const { Context, Provider } = createDataContext<CarModelResponse | undefined>(
  undefined,
)

export const CarModelContextProvider = Provider

export const useContextCarModel = () => {
  const { state, setState } = useContext(Context)
  return {
    carModel: state,
    setCarModel: setState,
  }
}
