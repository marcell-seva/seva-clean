import { useCallback, useEffect, useState } from 'react'

const eventList = ['scroll', 'touchstart', 'keydown', 'click']

export const useAfterInteractive = (
  executeFunc: () => void,
  dependencies: any[],
  options?: {
    id?: string
    unmountFunc?: () => void
  },
) => {
  const [interactive, setInteractive] = useState(false)

  const onInteractive = useCallback(() => {
    eventList.forEach((ev) => window.removeEventListener(ev, onInteractive))
    setInteractive(true)
  }, [...dependencies])

  useEffect(() => {
    if (!interactive) {
      eventList.forEach((ev) => window.addEventListener(ev, onInteractive))

      return () => setInteractive(false)
    }
  }, [...dependencies])

  useEffect(() => {
    if (interactive) {
      executeFunc()

      return () => {
        options?.unmountFunc && options.unmountFunc()
      }
    }
  }, [interactive])
}
