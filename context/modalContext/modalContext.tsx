import { useContext } from 'react'
import patchDataContext from '../patchDataContext/patchDataContext'

export interface ModalType {
  isOpenContactUsModal: boolean
  isOpenCarFilter: boolean
  isOpenPromoList: boolean
}

export const initData = {
  isOpenContactUsModal: false,
  isOpenCarFilter: false,
  isOpenPromoList: false,
}

const { Context, Provider } = patchDataContext<ModalType>(initData)

export const ModalContextProvider = Provider

export const useModalContext = () => {
  const { state, setState, patchState } = useContext(Context)

  return {
    modal: state,
    setModal: setState,
    patchModal: patchState,
  }
}
