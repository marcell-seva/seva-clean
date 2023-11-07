import React from 'react'
import styles from 'styles/components/molecules/refinancingInsuranceWidget.module.scss'
import AccLogo from 'public/revamp/icon/logo-acc.webp'
import TafLogo from 'public/revamp/icon/OldTafLogo.webp'
import OjkLogo from 'public/revamp/icon/OjkLogo.webp'
import Image from 'next/image'

export const RefinancingInsuranceWidget = () => {
  return (
    <div className={styles.container}>
      <div className={styles.logoSection}>
        <Image src={AccLogo} width={24} height={32} alt="Logo ACC" />
        <Image
          style={{ marginLeft: '16px' }}
          src={TafLogo}
          width={44.61}
          height={25.3}
          alt="Logo TAF"
        />
        <Image
          style={{ marginLeft: '13px' }}
          src={OjkLogo}
          width={53}
          height={23}
          alt="Logo OJK"
        />
      </div>
      <span className={styles.styledText}>
        PT. Astra Sedaya Finance, PT. Toyota Astra Financial Services, dan PT.
        Asuransi Astra Buana berizin dan diawasi oleh Otoritas Jasa Keuangan
      </span>
    </div>
  )
}
