import React from 'react'
import styles from '../../../styles/LocationList.module.css'
import { IconLocation } from '../../atoms'
export default function LocationList({ onClick }: any) {
  return (
    <div className={styles.wrapper}>
      <IconLocation width={16} height={16} color="#D83130" />
      <p className={styles.descText}>
        Beli mobil di <span className={styles.locText}>Jakarta Barat</span>{' '}
        <button onClick={onClick} className={styles.button}>
          Ganti Lokasi
        </button>
      </p>
    </div>
  )
}
