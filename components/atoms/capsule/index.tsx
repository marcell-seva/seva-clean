import React from 'react'
import styles from '../../../styles/atoms/Capsule.module.css'

interface Location {
  cityName: string
  cityCode: string
  id: number
  province: string
}
interface Props {
  item: Location
  onClick: any
}
export default function Capsule({ item, onClick }: Props) {
  return (
    <button className={styles.location} onClick={onClick}>
      <p className={styles.locationText}>{item.cityName}</p>
    </button>
  )
}
