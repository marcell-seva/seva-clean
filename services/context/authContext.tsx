import { createContext, useEffect, useState } from 'react'
import { setAmplitudeUserId } from '../amplitude'
import { api } from '../api'
import { User, Token, Filter } from 'utils/types'
import { encryptValue } from 'utils/encryptionUtils'
import { saveLocalStorage } from 'utils/handler/localStorage'
import { LocalStorageKey } from 'utils/enum'

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
  const token = dataToken !== null ? JSON.parse(dataToken) : null
  return token
}

const getDataFilter = (): Filter => {
  const dataFilter = localStorage.getItem('filter')
  const filter = dataFilter !== null ? JSON.parse(dataFilter) : null
  return filter
}

export const AuthProvider = ({ children }: any) => {
  const [userData, setUserData] = useState<User | null>(null)
  const [filter, setFilter] = useState<Filter | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  const getUserInfo = async () => {
    try {
      const res: any = await api.getUserInfo()
      const dataUser: any = res[0]
      saveAuthData(dataUser)
      const encryptedData = encryptValue(JSON.stringify(dataUser))
      saveLocalStorage(LocalStorageKey.sevaCust, encryptedData)
      setAmplitudeUserId(dataUser.id)
    } catch (error) {
      throw error
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
