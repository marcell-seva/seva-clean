import { createContext, useState } from 'react'
import { CarRecommendation } from 'utils/types/props'

export type RecommendationContextType = {
  recommendation: CarRecommendation[] | []
  saveRecommendation: (data: CarRecommendation[] | []) => void
}

export const RecommendationContext =
  createContext<RecommendationContextType | null>(null)

export const RecommendationContextProvider = ({ children }: any) => {
  const [recommendation, setRecommendation] = useState<
    CarRecommendation[] | []
  >([])

  const saveRecommendation = (recommendationData: CarRecommendation[] | []) => {
    setRecommendation(recommendationData)
  }

  return (
    <RecommendationContext.Provider
      value={{ recommendation, saveRecommendation }}
    >
      {children}
    </RecommendationContext.Provider>
  )
}
