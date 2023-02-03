import Image from 'next/image'
import React from 'react'
import styles from '../../../styles/atoms/Brand.module.css'
export default function Brand({ name, src, isActive, onClick }: any) {
  return (
    <div
      className={isActive ? styles.brandActive : styles.brandInActive}
      onClick={onClick}
    >
      <Image
        src={src}
        width={50}
        height={40}
        unoptimized
        className={styles.brandImage}
        alt={name}
      />
    </div>
  )
}
