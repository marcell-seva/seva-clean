import React from 'react'
import styles from 'styles/components/molecules/labelCard/common/common.module.scss'

type TCommonLabelProps = {
  title: string
}

const CommonLabel = ({ title }: TCommonLabelProps) => {
  return (
    <div className={`${styles.container} ${styles.labelResult}`}>
      <span className={styles.microBold}>{title}</span>
    </div>
  )
}
export default CommonLabel
