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
    executeFunc()
    ;['scroll', 'touchstart'].forEach((ev) =>
      window.removeEventListener(ev, onInteractive),
    )
    setInteractive(true)
  }, [...dependencies])

  useEffect(() => {
    if (!interactive) {
      ;['scroll', 'touchstart'].forEach((ev) =>
        window.addEventListener(ev, onInteractive),
      )

      return () => {
        options?.unmountFunc && options.unmountFunc()
      }
    }
  }, [interactive, ...dependencies])

  useEffect(() => {
    if (interactive && dependencies.length > 0) {
      executeFunc()

      return () => {
        options?.unmountFunc && options.unmountFunc()
      }
    }
  }, [...dependencies])
}
