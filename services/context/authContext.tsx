import { createContext, useEffect, useState } from 'react'
import { setAmplitudeUserId } from '../amplitude'
import { api } from '../api'

interface User {
  id: number
  phoneNumber: string
  fullName: string
  gender: string
  dob: any
  email: string
  createdAt: string
  updatedAt: string
  registType: any
  alreadyLogin: boolean
  marital: string
  promoSubscription: any
  temanSevaTrxCode: any
  customerUuid: any
  isSales: boolean
  salesBu: any
  isCrmCustomer: boolean
}

interface Token {
  expires: string
  idToken: string
  refreshToken: string
}
interface Filter {
  age: string
  downPaymentAmount: string
  monthlyIncome: string
  tenure: number
  carModel: string
  downPaymentType: string
  monthlyInstallment: any
  sortBy: string
}
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
      localStorage.setItem('seva-cust', JSON.stringify(dataUser))
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
    localStorage.setItem('filter', JSON.stringify(payload))
    setFilter(payload)
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userData, saveAuthData, filter, saveFilterData }}
    >
      {children}
    </AuthContext.Provider>
  )
}
