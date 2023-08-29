import { createContext, useEffect, useState } from 'react'
import { UTM } from 'utils/types'

export type ConfigContextType = {
  utm: UTM | null
  saveUTM: (data: UTM) => void
}

export const ConfigContext = createContext<ConfigContextType | null>(null)

const getDataUTM = () => {
  const res = localStorage.getItem('utmTags')
  const utm = res !== null ? JSON.parse(res) : null
  return utm
}

export const ConfigProvider = ({ children }: any) => {
  const [utm, setUtm] = useState<UTM | null>(null)

  useEffect(() => {
    const dataUTM = getDataUTM()
    if (dataUTM !== null) setUtm(dataUTM)
  }, [])

  const saveUTM = (utm: UTM) => {
    localStorage.setItem('utmTags', JSON.stringify(utm))
    setUtm(utm)
  }

  return (
    <ConfigContext.Provider value={{ utm, saveUTM }}>
      {children}
    </ConfigContext.Provider>
  )
}
