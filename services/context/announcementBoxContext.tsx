import { createContext, startTransition, useContext, useState } from 'react'

export type AnnouncementBoxContextType = {
  showAnnouncementBox: boolean
  saveShowAnnouncementBox: (value: boolean) => void
}

export const AnnouncementBox = createContext<AnnouncementBoxContextType>({
  showAnnouncementBox: false,
  saveShowAnnouncementBox: (value) => {},
})

export const AnnouncementBoxProvider = ({ children }: any) => {
  const [showAnnouncementBox, setShowAnnouncementBox] = useState(false)

  const saveShowAnnouncementBox = (value: boolean) => {
    startTransition(() => {
      setShowAnnouncementBox(value)
    })
  }

  return (
    <AnnouncementBox.Provider
      value={{
        showAnnouncementBox,
        saveShowAnnouncementBox,
      }}
    >
      {children}
    </AnnouncementBox.Provider>
  )
}

export const useAnnouncementBoxContext = () =>
  useContext(AnnouncementBox) as AnnouncementBoxContextType
