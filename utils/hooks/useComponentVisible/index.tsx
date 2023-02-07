import { useEffect, useRef } from 'react'
export const useComponentVisible = (handleOutsideClick: any) => {
  const innerBorderRef: any = useRef()

  const onClick = (event: any) => {
    if (
      innerBorderRef.current &&
      !innerBorderRef.current.contains(event.target)
    ) {
      handleOutsideClick()
    }
  }

  useMountEffect(() => {
    document.addEventListener('click', onClick, true)
    return () => {
      document.removeEventListener('click', onClick, true)
    }
  })

  return { innerBorderRef }
}

const useMountEffect = (fun: any) => useEffect(fun, [])
