import React from 'react'
import styles from 'styles/components/atoms/promoBadge.module.scss'

type SelectablePromoBadgeProps = {
  text: string
}
const FreeInsuranceBadge = ({ text }: SelectablePromoBadgeProps) => {
  return (
    <div className={styles.promoBadgeWrapper} style={{ background: '#E8F6F1' }}>
      <p className={styles.badgeText} style={{ color: '#1AA674' }}>
        {text}
      </p>
    </div>
  )
}

export default FreeInsuranceBadge
