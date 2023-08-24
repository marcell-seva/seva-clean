import { IsSsrMobileContext } from 'services/context/isSsrMobileContext'
import { useContext } from 'react'
import { useWindowSize } from '../useWindowSize'

export const useIsMobileSSr = () => {
  const isSsrMobile = useContext(IsSsrMobileContext)
  const { width: windowWidth } = useWindowSize()
  const isBrowserMobile = !!windowWidth && windowWidth < 1024

  return isSsrMobile || isBrowserMobile
}
