import React from 'react'
import styles from 'styles/components/organisms/internalErrorPageContent.module.scss'
import Image from 'next/image'
import MainImage from 'public/revamp/illustration/internal-server-error.svg'

export const InternalServerErrorPageContent = () => {
  return (
    <div className={styles.container}>
      <Image
        src={MainImage}
        width={247}
        height={226}
        alt="Internal Error Page Illustration"
      />
      <h2 className={styles.title}>Kesalahan Server Internal</h2>
      <span className={styles.subtitle}>
        Mohon maaf server kami saat ini
        <br />
        mengalami masalah teknis.
        <br />
        Kami sedang memperbaikinya.
      </span>
    </div>
  )
}
