import { IconSecure } from 'components/atoms'
import React from 'react'
import styles from '/styles/components/molecules/labelAccount.module.scss'

const LabelAccount = () => {
  return (
    <div className={styles.badge}>
      <div className={styles.badge__icon}>
        <IconSecure color="#246ED4" width={24} height={24} />
      </div>
      <span>Lengkapi data akun kamu</span>
    </div>
  )
}

export default LabelAccount
