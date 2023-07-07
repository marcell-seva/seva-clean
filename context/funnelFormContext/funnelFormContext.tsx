import { useContext } from 'react'
import { FormControlValue } from 'utils/types'
import patchDataContext from '../patchDataContext/patchDataContext'

export interface FunnelForm {
  paymentType?: FormControlValue
  monthlyInstallment?: FormControlValue
  downPaymentAmount?: FormControlValue
  carModel?: FormControlValue
}

const initData = {
  paymentType: 'downPayment',
  monthlyInstallment: '',
  downPaymentAmount: '',
  carModel: '',
}
const { Context, Provider } = patchDataContext<FunnelForm>(initData)

export const FunnelFormContextProvider = Provider

export const useFunnelFormData = () => {
  const { state, setState, patchState, clearState } = useContext(Context)
  return {
    funnelForm: state,
    setFunnelForm: setState,
    patchFunnelForm: patchState,
    clearFunnelForm: clearState,
  }
}
