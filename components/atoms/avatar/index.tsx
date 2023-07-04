import React from 'react'
import styles from 'styles/components/atoms/avatar.module.scss'

interface AvatarProps {
  title?: string
}

const Avatar = ({ title }: AvatarProps) => {
  return (
    <div className={styles.avatar}>
      <span>{title}</span>
    </div>
  )
}
export default Avatar
