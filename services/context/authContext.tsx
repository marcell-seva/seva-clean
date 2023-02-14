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

interface DP {
  downPaymentAmount: string
  downPaymentType: string
}
export type AuthContextType = {
  isLoggedIn: boolean
  dp: string
  userData: User | null
  saveAuthData: (data: User) => void
  saveDp: (data: string) => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

const getDataToken = () => {
  const dataToken = localStorage.getItem('token')
  const token = dataToken !== null ? JSON.parse(dataToken) : null
  return token
}

const getDataDp = () => {
  const dataDp = localStorage.getItem('filter')
  const dp = dataDp !== null ? JSON.parse(dataDp) : null
  return dp
}
export const AuthProvider = ({ children }: any) => {
  const [userData, setUserData] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [dp, setDp] = useState<string>('')

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
    const dataDp = getDataDp()
    setIsLoggedIn(dataToken !== null)
    if (dataToken !== null) getUserInfo()
    if (dataDp !== null) setDp(dataDp.downPaymentAmount)
  }, [])

  const saveAuthData = (auth: User) => {
    setUserData(auth)
  }

  const saveDp = (payload: string) => {
    const data = {
      downPaymentAmount: payload,
      downPaymentType: 'amount',
    }
    localStorage.setItem('filter', JSON.stringify(data))
    setDp(payload)
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userData, saveAuthData, dp, saveDp }}
    >
      {children}
    </AuthContext.Provider>
  )
}
