import React from 'react'
import styles from 'styles/components/atoms/promoBadge.module.scss'

type SelectablePromoBadgeProps = {
  text: string
}
const CashbackBadge = ({ text }: SelectablePromoBadgeProps) => {
  return (
    <div className={styles.promoBadgeWrapper} style={{ background: '#F8F4E0' }}>
      <div className={styles.cashbackText}>Rp</div>
      <p className={styles.badgeText} style={{ color: '#DFA26A' }}>
        {text}
      </p>
    </div>
  )
}

export default CashbackBadge
