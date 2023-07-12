import React, { HTMLAttributes } from 'react'
import styles from 'styles/components/molecules/labelCard/mudah/mudah.module.scss'
import { IconChecked } from 'components/atoms/icons'
import { colors } from 'utils/helpers/style/colors'

const LabelMudah = ({ ...props }: HTMLAttributes<HTMLDivElement>) => {
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

export default LabelMudah
