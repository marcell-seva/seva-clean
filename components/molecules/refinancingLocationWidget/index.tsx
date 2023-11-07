import { WhatsAppIcon } from 'components/atoms/icon/WhatsAppIcon'
import React from 'react'
import styles from 'styles/components/molecules/refinancingLocationWidget.module.scss'

export const RefinancingLocationWidget = () => {
  return (
    <div className={styles.container}>
      <span className={styles.styledText}>
        Menara Astra
        <br />
        <span style={{ fontFamily: 'OpenSans', fontWeight: '400' }}>
          Jl. Jenderal Sudirman No.Kav 5-6 Lantai 56
          <br />
          Jakarta Pusat, DKI Jakarta
          <br />
          10220
        </span>
      </span>
      <div className={styles.whatsappSection}>
        <WhatsAppIcon width={14} height={14} color={'#52627A'} />
        <span className={styles.styledText}>+62 896-9000-8888</span>
      </div>
    </div>
  )
}
