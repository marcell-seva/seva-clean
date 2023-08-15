import { createContext, useContext, useState } from 'react'

export type GalleryContextType = {
  galleryFile: string | undefined
  setGalleryFile: (data: string) => void
  photoFile: any | undefined
  setPhotoFile: (data: any) => void
}

export const GalleryContext = createContext<GalleryContextType>({
  galleryFile: undefined,
  setGalleryFile: () => {},
  photoFile: undefined,
  setPhotoFile: () => {},
})

export const GalleryContextProvider = ({ children }: any) => {
  const [galleryFile, setGalleryFile] = useState<string | undefined>(undefined)
  const [photoFile, setPhotoFile] = useState<any | undefined>(undefined)

  return (
    <GalleryContext.Provider
      value={{
        galleryFile,
        setGalleryFile,
        photoFile,
        setPhotoFile,
      }}
    >
      {children}
    </GalleryContext.Provider>
  )
}

export const useGalleryContext = () =>
  useContext(GalleryContext) as GalleryContextType
