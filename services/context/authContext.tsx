import { createContext, useEffect, useState } from 'react'
import { setAmplitudeUserId } from '../amplitude'
import { User, Token, Filter } from 'utils/types'
import { encryptValue } from 'utils/encryptionUtils'
import { saveLocalStorage } from 'utils/handler/localStorage'
import { LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { getUserInfo as gui } from 'services/api'
import { LoginSevaUrl } from 'utils/helpers/routes'
import { destroySessionMoEngage } from 'helpers/moengage'

export type AuthContextType = {
  isLoggedIn: boolean
  filter: Filter | null
  userData: User | null
  saveAuthData: (data: User) => void
  saveFilterData: (data: Filter) => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

const getDataToken = (): Token => {
  const dataToken = localStorage.getItem('token')
  const token = !!dataToken ? JSON.parse(dataToken) : null
  return token
}

const getDataFilter = (): Filter => {
  const dataFilter = localStorage.getItem('filter')
  const filter = !!dataFilter ? JSON.parse(dataFilter) : null
  return filter
}

export const removeInformationWhenLogout = () => {
  localStorage.removeItem(LocalStorageKey.Token)
  localStorage.removeItem(LocalStorageKey.CustomerId)
  localStorage.removeItem(LocalStorageKey.sevaCust)
  sessionStorage.removeItem(SessionStorageKey.CustomerId)
  sessionStorage.removeItem(SessionStorageKey.prevLoginPath)

  // MoEngage.destroySession()
  destroySessionMoEngage()
}

export const AuthProvider = ({ children }: any) => {
  const [userData, setUserData] = useState<User | null>(null)
  const [filter, setFilter] = useState<Filter | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  const getUserInfo = async () => {
    try {
      const res: any = await getUserInfo()
      const dataUser: any = res[0]
      saveAuthData(dataUser)
      const encryptedData = encryptValue(JSON.stringify(dataUser))
      saveLocalStorage(LocalStorageKey.sevaCust, encryptedData)
      setAmplitudeUserId(dataUser.id)
    } catch (error) {
      removeInformationWhenLogout()
      ;(await import('next/router')).default.replace(LoginSevaUrl)
    }
  }

  useEffect(() => {
    const dataToken = getDataToken()
    const dataFilter = getDataFilter()
    setIsLoggedIn(dataToken !== null)
    if (dataToken !== null) getUserInfo()
    if (dataFilter !== null) setFilter(dataFilter)
  }, [])

  const saveAuthData = (auth: User) => {
    setUserData(auth)
  }

  const saveFilterData = (payload: Filter) => {
    const dataFilterLocal = localStorage.getItem('filter')
    const dataFilterParsed =
      dataFilterLocal !== null ? JSON.parse(dataFilterLocal) : null
    const newDataFilter = {
      ...dataFilterParsed,
      ...payload,
    }
    localStorage.setItem('filter', JSON.stringify(newDataFilter))
    setFilter(newDataFilter)
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userData, saveAuthData, filter, saveFilterData }}
    >
      {children}
    </AuthContext.Provider>
  )
}
