import React, { ButtonHTMLAttributes } from 'react'
import styles from 'styles/saas/components/atoms/textButton.module.scss'

interface TextButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  leftIcon?: () => JSX.Element
  rightIcon?: () => JSX.Element
  additionalClassName?: string
  children: React.ReactNode
}

export const TextButton = ({
  leftIcon,
  children,
  rightIcon,
  additionalClassName,
  ...restProps
}: TextButtonProps) => {
  return (
    <button
      className={`${styles.primary} ${additionalClassName}`}
      {...restProps}
    >
      {leftIcon && leftIcon()}
      {children}
      {rightIcon && rightIcon()}
    </button>
  )
}
