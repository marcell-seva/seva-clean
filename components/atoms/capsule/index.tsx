import React from 'react'
import styles from '../../../styles/atoms/Capsule.module.css'
interface Props {
  name: string
}
export default function Capsule({ name }: Props) {
  return (
    <div className={styles.location}>
      <p className={styles.locationText}>{name}</p>
    </div>
  )
}
