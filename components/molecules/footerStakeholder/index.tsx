import { IconACC } from 'components/atoms/icon/ACC'
import { IconLockFill } from 'components/atoms/icon/LockFill'
import elementId from 'helpers/elementIds'
import Image from 'next/image'
import React from 'react'
import styles from 'styles/components/organisms/landingIA.module.scss'

const ISOIcon = '/revamp/icon/iso.webp'
const AstraFinancialIcon = '/revamp/icon/Logo-Astra-Financial.webp'
const TAFIcon = '/revamp/icon/Logo-TAF.png'

export const FooterStakeholder = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.iconWrapper} style={{ gap: 4 }}>
        <IconLockFill width={10} height={10} />
        <span>Kami menjamin datamu aman dan terlindungi</span>
      </div>
      <div className={styles.iconWrapper}>
        <Image
          src={ISOIcon}
          width={26}
          height={27}
          alt="CBQA ISO 27001"
          datatest-id={elementId.Footer.LogoISO}
        />
        <IconACC width={40} height={40} />
        <Image src={TAFIcon} width={40} height={40} alt="TAF" />
        <Image
          src={AstraFinancialIcon}
          width={114}
          height={40}
          alt="Astra Financial"
        />
      </div>
    </div>
  )
}
