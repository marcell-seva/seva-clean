import { client } from './helpers/const'

export const getPageName = () => {
  if (client) {
    const pathname = window.location.pathname
    if (pathname === '/') {
      return 'Homepage'
    } else if (pathname === '/mobil-baru') {
      return 'PLP'
    }
  } else {
    return ''
  }
}
