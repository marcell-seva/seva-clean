import React, { HTMLAttributes } from 'react'
import { IconChecked } from 'components/atoms/icon'
import styles from '../../../../styles/saas/components/molecules/labelCard/mudah/mudah.module.scss'
import { colors } from 'styles/colors'

export const LabelMudah = ({ ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`${styles.container} ${styles.labelResult}`} {...props}>
      <IconChecked
        height={16}
        width={16}
        color={colors.white}
        fillColor="#1AA674"
      />
      <span className={styles.microBold}>Mudah disetujui</span>
    </div>
  )
}
