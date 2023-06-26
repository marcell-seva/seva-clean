import React, { HTMLAttributes } from 'react'
import { IconWarningCircle } from 'components/atoms/icon'
import styles from '../../../../styles/saas/components/molecules/labelCard/sulit/sulit.module.scss'
import { colors } from 'styles/colors'

export const LabelSulit = ({ ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`${styles.container} ${styles.labelResult}`} {...props}>
      <IconWarningCircle
        height={16}
        width={16}
        color={colors.white}
        fillColor="#B4231E"
      />
      <span className={styles.microBold}>Sulit disetujui</span>
    </div>
  )
}
