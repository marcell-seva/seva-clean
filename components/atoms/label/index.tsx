import React from 'react'
import styles from '../../../styles/components/atoms/label.module.scss'

interface Props {
  children: React.ReactNode
  name: string
}

export const Label: React.FC<Props> = ({ children, name }) => {
  return (
    <label htmlFor={name} className={styles.label}>
      {children}
    </label>
  )
}
