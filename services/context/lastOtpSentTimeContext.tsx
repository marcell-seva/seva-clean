import React, { createContext, useContext } from 'react'
import { useSessionStorage } from 'utils/hooks/useSessionStorage/useSessionStorage'
import { LocalStorageKey } from 'utils/types/models'
interface LastOtpSentTimeContext {
  lastOtpSentTime: number
  setLastOtpSentTime: (value: number) => void
}
export const LastOtpSentTimeContextType: LastOtpSentTimeContext = {
  lastOtpSentTime: 0,
  setLastOtpSentTime: (value: number) => {
    console.log(value)
  },
}
export const LastOtpSentTimeContext = createContext(LastOtpSentTimeContextType)

export const LastOtpSentTimeContextProvider = ({ children }: any) => {
  const [lastOtpSentTime, setLastOtpSentTime] = useSessionStorage<number>(
    LocalStorageKey.LastOtpSent,
    0,
  )

  return (
    <LastOtpSentTimeContext.Provider
      value={{ lastOtpSentTime, setLastOtpSentTime }}
    >
      <>{children}</>
    </LastOtpSentTimeContext.Provider>
  )
}

export const useLastOtpSentTime = () => useContext(LastOtpSentTimeContext)
