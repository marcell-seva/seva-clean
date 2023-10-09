import { useEffect, useState } from 'react'

export const useAfterInteractive = (
  executeFunc: () => void,
  dependencies: any[],
) => {
  const [interactive, setInteractive] = useState(false)

  const onInteractive = () => {
    if (!interactive) {
      setInteractive(true)
      executeFunc()
      ;['scroll', 'touchstart'].forEach((ev) =>
        window.removeEventListener(ev, onInteractive),
      )
    }
  }

  useEffect(() => {
    ;['scroll', 'touchstart'].forEach((ev) =>
      window.addEventListener(ev, onInteractive),
    )

    return () => {
      ;['scroll', 'touchstart'].forEach((ev) =>
        window.removeEventListener(ev, onInteractive),
      )
    }
  }, [interactive])

  useEffect(() => {
    if (interactive) {
      executeFunc()
    }
  }, [...dependencies])
}
