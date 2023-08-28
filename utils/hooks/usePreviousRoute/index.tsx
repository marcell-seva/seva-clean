import { useRouter } from 'next/router'
import { useRef, useEffect } from 'react'

export const usePreviousRoute = () => {
  const { asPath } = useRouter()

  const ref = useRef<string | null>(null)

  useEffect(() => {
    ref.current = asPath
  }, [asPath])

  return ref.current
}
