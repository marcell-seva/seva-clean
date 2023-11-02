import { useCallback, useEffect, useState } from 'react'

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
    ;['scroll', 'touchstart', 'keydown'].forEach((ev) =>
      window.removeEventListener(ev, onInteractive),
    )
    setInteractive(true)
  }, [...dependencies])

  useEffect(() => {
    if (!interactive) {
      ;['scroll', 'touchstart', 'keydown'].forEach((ev) =>
        window.addEventListener(ev, onInteractive),
      )

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
