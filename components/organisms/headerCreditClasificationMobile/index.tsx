import React from 'react'
import styles from 'styles/components/organisms/headerCreditClasificationMobile.module.scss'

import { useRouter } from 'next/router'
import { IconChevronLeft } from 'components/atoms'

const LogoPrimary = '/revamp/icon/logo-primary.webp'

const HeaderCreditClasificationMobile = (): JSX.Element => {
  const router = useRouter()

  return (
    <>
      <div className={styles.container}>
        <div onClick={() => router.back()} className={styles.chevronLeft}>
          <IconChevronLeft height={24} width={24} />
        </div>
        <div className={styles.logoMiddle}>
          <img src={LogoPrimary} width={58} alt="seva" />
        </div>
      </div>
    </>
  )
}

export default HeaderCreditClasificationMobile
