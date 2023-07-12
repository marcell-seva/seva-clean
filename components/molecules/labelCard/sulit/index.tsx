import { IconWarningCircle } from 'components/atoms/icons'
import React, { HTMLAttributes } from 'react'
import styles from 'styles/components/molecules/labelCard/sulit/sulit.module.scss'
import { colors } from 'utils/helpers/style/colors'

const LabelSulit = ({ ...props }: HTMLAttributes<HTMLDivElement>) => {
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

export default LabelSulit
