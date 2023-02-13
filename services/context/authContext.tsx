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

export type AuthContextType = {
  userData: User | null
  saveAuthData: (data: User) => void
  isLoggedIn: boolean
}

export const AuthContext = createContext<AuthContextType | null>(null)

const getDataToken = () => {
  const dataToken = localStorage.getItem('token')
  const token = dataToken !== null ? JSON.parse(dataToken) : null
  return token
}

export const AuthProvider = ({ children }: any) => {
  const [userData, setUserData] = useState<User | null>(null)
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
    setIsLoggedIn(dataToken !== null)
    if (dataToken !== null) {
      getUserInfo()
    }
  }, [])

  const saveAuthData = (auth: User) => {
    setUserData(auth)
  }

  return (
    <AuthContext.Provider value={{ userData, saveAuthData, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  )
}
