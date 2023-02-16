import Image from 'next/image'
import React from 'react'
import styles from '../../../styles/atoms/Brand.module.css'
import { PropsBrand } from '../../../utils/types/props'

const Brand: React.FC<PropsBrand> = ({
  name,
  src,
  isActive,
  onClick,
}): JSX.Element => {
  return (
    <div
      className={isActive ? styles.brandActive : styles.brandInActive}
      onClick={onClick}
    >
      <Image
        src={src}
        width={50}
        height={40}
        sizes="9vw"
        className={styles.brandImage}
        alt={name}
      />
    </div>
  )
}
export default Brand
