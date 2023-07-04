import React from 'react'
import styles from '../../../styles/saas/components/atoms/avatar.module.scss'

interface AvatarProps {
  title?: string
}

export const Avatar = ({ title }: AvatarProps) => {
  return (
    <div className={styles.avatar}>
      <span>{title}</span>
    </div>
  )
}
