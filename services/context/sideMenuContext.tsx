import { useContext } from 'react'
import patchDataContext from './patchDataContext'

export interface SideMenuType {
  isOpenLevel1: boolean
  isOpenBeliMobil: boolean
  isOpenArtikel: boolean
  isOpenLainnya: boolean
}

export const initData = {
  isOpenLevel1: false,
  isOpenBeliMobil: false,
  isOpenArtikel: false,
  isOpenLainnya: false,
}

const { Context, Provider } = patchDataContext<SideMenuType>(initData)

export const SideMenuContextProvider = Provider

export const useSideMenuContext = () => {
  const { state, setState, patchState } = useContext(Context)

  return {
    sideMenu: state,
    setSideMenu: setState,
    patchSideMenu: patchState,
  }
}
