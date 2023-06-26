import { useEffect } from 'react'

export const useAmplitudePageView = (eventTrackingFunction: () => void) => {
  useEffect(() => {
    eventTrackingFunction()
  }, [])
}
