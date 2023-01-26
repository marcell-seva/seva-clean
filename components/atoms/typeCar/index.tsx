import Image from 'next/image'
import React from 'react'
import styles from '../../../styles/atoms/TypeCar.module.css'

interface PropsType {
  name: string
  src: string
  onClick: any
  isActive?: boolean
}
export default function TypeCar({
  name,
  src,
  onClick,
  isActive = false,
}: PropsType) {
  return (
    <button
      className={isActive ? `${styles.active}` : `${styles.inActive}`}
      onClick={onClick}
    >
      <Image
        src={src}
        width={50}
        height={30}
        alt="icon-type-car"
        className={styles.icon}
      />
      <p className={styles.labelType}>{name}</p>
    </button>
  )
}
