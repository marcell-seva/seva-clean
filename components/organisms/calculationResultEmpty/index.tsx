import Image from 'next/image'
import React from 'react'
import styles from 'styles/components/organisms/calculationResultEmpty.module.scss'

const MainImage = '/revamp/illustration/loan-calculator.webp'

export const CalculationResultEmpty = () => {
  return (
    <div className={styles.container}>
      <Image
        src={MainImage}
        width={500}
        height={500}
        className={styles.mainImage}
        alt="loan calculator"
      />
      <span className={styles.text}>
        Isi data di atas untuk
        <br />
        mengetahui kemampuan finansialmu.
      </span>
    </div>
  )
}
