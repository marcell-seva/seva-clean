import React, { HTMLAttributes } from 'react'
import styles from 'styles/components/molecules/labelCard/promo/promo.module.scss'
import { IconPromo } from 'components/atoms/icons'
import { colors } from 'utils/helpers/style/colors'

const LabelPromo = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`${styles.container} ${className}`} {...props}>
      <IconPromo height={16} width={16} color={colors.white} />
      <span className={styles.microReguler}>
        Tersedia <span className={styles.microBold}>promo</span>
      </span>
    </div>
  )
}
export default LabelPromo
