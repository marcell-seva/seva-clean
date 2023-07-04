import React from 'react'
import styles from 'styles/saas/components/atoms/errorMessage.module.scss'

interface ErrorMessageProps {
  children: React.ReactNode
}

const ErrorMessage = ({ children }: ErrorMessageProps) => {
  return <p className={styles.text}>{children}</p>
}

export default ErrorMessage
