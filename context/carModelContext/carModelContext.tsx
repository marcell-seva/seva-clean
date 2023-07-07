import { useContext } from 'react'
import createDataContext from '../createDataContext'
import { CarModelResponse } from 'utils/types'

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
