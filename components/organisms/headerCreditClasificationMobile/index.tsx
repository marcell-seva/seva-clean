import React from 'react'
import styles from 'styles/components/organisms/headerCreditClasificationMobile.module.scss'

import { useRouter } from 'next/router'
import { IconChevronLeft } from 'components/atoms'
import Image from 'next/image'

const LogoPrimary = '/revamp/icon/logo-primary.webp'

const HeaderCreditClasificationMobile = (): JSX.Element => {
  const router = useRouter()

  return (
    <div className={styles.box}>
      <div className={styles.container}>
        <div onClick={() => router.back()} className={styles.chevronLeft}>
          <IconChevronLeft height={24} width={24} />
        </div>
        <div className={styles.logoMiddle}>
          <Image src={LogoPrimary} width={58} height={35} alt="seva" />
        </div>
      </div>
    </div>
  )
}

export default HeaderCreditClasificationMobile
