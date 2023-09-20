import { IsSsrMobileContext } from 'services/context/isSsrMobileContext'
import { useContext } from 'react'
import { useWindowSize } from '../useWindowSize'

export const useIsMobileSSr = () => {
  const isSsrMobile = useContext(IsSsrMobileContext)

  return isSsrMobile
}
