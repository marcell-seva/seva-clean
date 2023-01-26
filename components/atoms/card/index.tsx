import Image from 'next/image'
import React from 'react'
import styles from '../../../styles/atoms/Card.module.css'

export default function Card({ item }: any) {
  return (
    <div className={styles.card}>
      <Image
        src={item.image}
        width={600}
        height={420}
        alt="seva-banner"
        quality={30}
        className={styles.image}
      />
      <div className={styles.detail}>
        <div>
          <h1 className={styles.titleText}>
            {item.brand} {item.model}
          </h1>
        </div>
        <div>
          <p className={styles.subTitleText}>Cicilan mulai dari </p>
          <p className={styles.price}>Rp {item.highestAssetPrice} jt</p>
        </div>
      </div>
    </div>
  )
}
