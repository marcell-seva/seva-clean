import { useContext } from 'react'
import { MobileWebTopMenuType } from 'utils/types/utils'
import createDataContext from '../createDataContext'

const { Context, Provider } = createDataContext<MobileWebTopMenuType[]>([])

export const MobileWebTopMenusContextProvider = Provider

export const useContextMobileWebTopMenus = () => {
  const { state, setState } = useContext(Context)
  return {
    mobileWebTopMenus: state,
    setMobileWebTopMenus: setState,
  }
}
