import Image from 'next/image'
import React from 'react'
import styles from '../../../styles/atoms/Logo.module.css'
import logoSeva from '../../../assets/images/logo/seva-header.svg'

export default function Logo() {
  const rootUrl: string = 'https://seva.id'
  return (
    <a href={rootUrl} className={styles.wrapperLogo}>
      <Image
        src={logoSeva}
        width={120}
        height={75}
        alt="seva-logo"
        priority
        className={styles.logo}
      />
    </a>
  )
}
