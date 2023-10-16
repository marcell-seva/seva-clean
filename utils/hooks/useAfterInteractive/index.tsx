import { useCallback, useEffect, useState } from 'react'

export const useAfterInteractive = (
  executeFunc: () => void,
  dependencies: any[],
) => {
  const [interactive, setInteractive] = useState(false)

  const onInteractive = useCallback(() => {
    if (!interactive) {
      executeFunc()
      ;['scroll', 'touchstart'].forEach((ev) =>
        window.removeEventListener(ev, onInteractive),
      )
      setInteractive(true)
    }
  }, [])

  useEffect(() => {
    if (!interactive) {
      ;['scroll', 'touchstart'].forEach((ev) =>
        window.addEventListener(ev, onInteractive),
      )
    }
  }, [interactive])

  useEffect(() => {
    if (interactive && dependencies.length > 0) {
      executeFunc()
    }
  }, [...dependencies])
}
