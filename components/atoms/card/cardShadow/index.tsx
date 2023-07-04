import React, { ForwardedRef, forwardRef, HTMLAttributes } from 'react'
import styles from 'styles/components/atoms/card/cardshadow.module.scss'

const CardShadow = (
  { children, className, ...props }: HTMLAttributes<HTMLDivElement>,
  ref?: ForwardedRef<HTMLDivElement>,
) => {
  return (
    <div ref={ref} className={`${className} ${styles.cardShadow}`} {...props}>
      {children}
    </div>
  )
}

export default forwardRef(CardShadow)
