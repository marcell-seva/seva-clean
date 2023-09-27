import Image from 'next/image'
import React from 'react'
import styles from 'styles/components/atoms/promoBadge.module.scss'

const IconAstraPay = '/revamp/icon/IconAstraPay.webp'

type SelectablePromoBadgeProps = {
  text: string
}
const CashbackAstrapayBadge = ({ text }: SelectablePromoBadgeProps) => {
  return (
    <div className={styles.promoBadgeWrapper} style={{ background: '#EEF6FB' }}>
      <Image src={IconAstraPay} width="6.6" height="6" alt="icon astra pay" />
      <p className={styles.badgeText} style={{ color: '#51A8DB' }}>
        {text}
      </p>
    </div>
  )
}

export default CashbackAstrapayBadge
