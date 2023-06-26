import { useContext } from 'react'
import { CarRecommendation } from 'utils/types/context'
import createDataContext from '../createDataContext'

const { Context, Provider } = createDataContext<CarRecommendation[]>([])

export const RecommendationsContextProvider = Provider

export const useContextRecommendations = () => {
  const { state, setState } = useContext(Context)
  return {
    recommendations: state,
    setRecommendations: setState,
  }
}
