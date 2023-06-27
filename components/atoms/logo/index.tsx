import Image from 'next/image'
import React from 'react'
import styles from '../../../styles/saas/components/atoms/Logo.module.scss'
import logoSeva from 'assets/images/logo/seva-header.svg'

const Logo: React.FC = (): JSX.Element => {
  const rootUrl: string = 'https://seva.id'
  return (
    <a href={rootUrl} className={styles.logo}>
      <Image
        src={logoSeva}
        width={120}
        height={75}
        alt="seva-logo"
        priority
        className={styles.logoImages}
      />
    </a>
  )
}

export default Logo
