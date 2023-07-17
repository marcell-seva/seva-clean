import { useContext } from 'react'
import patchDataContext from '../patchDataContext/patchDataContext'

export interface SideMenuListType {
  isMenuLevel1: boolean
  isMenuBeliMobil: boolean
  isMenuArtikel: boolean
  isMenuLainnya: boolean
}

export const initData = {
  isMenuLevel1: true,
  isMenuBeliMobil: false,
  isMenuArtikel: false,
  isMenuLainnya: false,
}

const { Context, Provider } = patchDataContext<SideMenuListType>(initData)

export const SideMenuListContextProvider = Provider

export const useSideMenuListContext = () => {
  const { state, setState, patchState } = useContext(Context)

  return {
    sideMenuList: state,
    setSideMenuList: setState,
    patchSideMenuList: patchState,
  }
}
