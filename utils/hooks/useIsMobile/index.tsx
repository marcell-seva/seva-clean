import React, { useEffect, useState } from 'react'

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean>()

  useEffect(() => {
    const updateMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    updateMobile()
    window.addEventListener('resize', updateMobile)
    return () => {
      window.removeEventListener('resize', updateMobile)
    }
  }, [])
  return isMobile
}
