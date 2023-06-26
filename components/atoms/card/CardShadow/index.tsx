import React, { ForwardedRef, forwardRef, HTMLAttributes } from 'react'
import styles from 'styles/atoms/card/cardshadow.module.scss'

const forwardCardShadow = (
  { children, className, ...props }: HTMLAttributes<HTMLDivElement>,
  ref?: ForwardedRef<HTMLDivElement>,
) => {
  return (
    <div ref={ref} className={`${className} ${styles.cardShadow}`} {...props}>
      {children}
    </div>
  )
}

export const CardShadow = forwardRef(forwardCardShadow)
