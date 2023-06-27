import React from 'react'
import styles from '../../../../styles/saas/components/molecules/labelCard/common/common.module.scss'

type TCommonLabelProps = {
  title: string
}

export default function CommonLabel({ title }: TCommonLabelProps) {
  return (
    <div className={`${styles.container} ${styles.labelResult}`}>
      <span className={styles.microBold}>{title}</span>
    </div>
  )
}
