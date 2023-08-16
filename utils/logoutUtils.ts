import { logoutModalId } from '../utils/helpers/const'
// import { setAmplitudeUserId } from 'helpers/amplitude'
import { destroySessionMoEngage } from 'helpers/moengage'
import { LocalStorageKey, SessionStorageKey } from './enum'
// import MoEngage from 'react-moengage'

// export const showLogoutModal = () => {
//   const logoutDom = document.getElementById(logoutModalId)
//   if (logoutDom) {
//     logoutDom.style.display = 'flex'
//   }

//   trackViewLogoutModal()
// }

export const hideLogout = () => {
  const logoutDom = document.getElementById(logoutModalId)
  if (logoutDom) {
    logoutDom.style.display = 'none'
  }
}

export const removeInformationWhenLogout = () => {
  localStorage.removeItem(LocalStorageKey.Token)
  localStorage.removeItem(LocalStorageKey.CustomerId)
  localStorage.removeItem(LocalStorageKey.sevaCust)
  sessionStorage.removeItem(SessionStorageKey.CustomerId)
  // MoEngage.destroySession()
  destroySessionMoEngage()
  // setAmplitudeUserId(null)
}
