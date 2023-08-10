import {
  CarResultParameters,
  CarResultQuery,
} from 'helpers/amplitude/newFunnelEventTracking'
import { useEffect } from 'react'
import { useFunnelFormData } from 'services/context/funnelFormContext'

export const useAmplitudePageView = (eventTrackingFunction: () => void) => {
  useEffect(() => {
    eventTrackingFunction()
  }, [])
}

export const useCarResultParameter = (): CarResultParameters => {
  const { funnelForm } = useFunnelFormData()
  const carResultObj: CarResultQuery = {
    monthlyInstallment: null,
    downPayment: null,
  }
  const monthlyInstallment = funnelForm.monthlyInstallment
  const downPayment = funnelForm.downPaymentAmount
  if (monthlyInstallment) {
    carResultObj.monthlyInstallment = Number(monthlyInstallment)
  }
  if (downPayment) {
    carResultObj.downPayment = Number(downPayment)
  }
  return {
    carResultParameters: carResultObj,
  }
}
