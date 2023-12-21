import React from 'react'
import styles from 'styles/components/atoms/toastSevaRefi.module.scss'

interface Props {
  content: React.ReactNode
  additionalClassname?: string
}

export const ToastSevaRefi = ({ content, additionalClassname }: Props) => {
  return (
    <>
      <div className={`${styles.styledToast} ${additionalClassname}`}>
        {content}
      </div>
    </>
  )
}
