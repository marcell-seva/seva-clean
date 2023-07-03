import React, { createContext, useContext } from 'react'
import { LocalStorageKey } from 'utils/enum'
import { useSessionStorage } from 'utils/hooks/useSessionStorage/useSessionStorage'
interface ActionContextType {
  lastOtpSentTime: number
  setLastOtpSentTime: (value: number) => void
}
const defaultContextValue: ActionContextType = {
  lastOtpSentTime: 0,
  setLastOtpSentTime: (value: number) => {
    console.log(value)
  },
}
const LastOtpSentTimeContext = createContext(defaultContextValue)

export const LastOtpSentTimeContextProviderRevamp = ({
  children,
}: HTMLElement) => {
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
